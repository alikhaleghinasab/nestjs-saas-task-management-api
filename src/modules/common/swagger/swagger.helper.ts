import { Buffer } from 'buffer';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version as packageVersion } from '../../../../package.json';
import { UnauthorizedException, Logger } from '@nestjs/common';

export class SwaggerHelper {
  private readonly logger = new Logger(SwaggerHelper.name);
  private readonly basePath = process.env.SWAGGER_PATH || '';
  private readonly username = process.env.SWAGGER_USERNAME || '';
  private readonly password = process.env.SWAGGER_PASSWORD || '';
  private readonly title = process.env.SWAGGER_TITLE || 'API Docs';
  private readonly description = process.env.SWAGGER_DESCRIPTION || '';

  private readonly credentialRegex = /^([^:]*):(.*)$/;

  setup(app: NestFastifyApplication) {
    if (!this.basePath || !this.username || !this.password) {
      this.logger.warn('Swagger disabled: configuration missing.');
      return;
    }

    const config = new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion(packageVersion)
      .addBearerAuth()
      .build();

    const fastify = app.getHttpAdapter().getInstance();

    fastify.register(
      (instance, _, next) => {
        instance.addHook('onRequest', this.basicAuthInterceptor.bind(this));
        next();
      },
      { prefix: this.getBasePath() },
    );

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(this.basePath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        docExpansion: 'none',
        filter: true,
        operationsSorter: 'alpha',
      },
    });

    this.logger.log(`Swagger enabled at ${this.getBasePath()}`);
  }

  getBasePath() {
    return this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;
  }

  private sendUnauthorized(reply, next) {
    reply.header('WWW-Authenticate', 'Basic realm="swagger" charset="UTF-8"');
    next(new UnauthorizedException());
  }

  private basicAuthInterceptor(request, reply, next) {
    const authHeader = request.headers['authorization'];

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Basic ')) {
      return this.sendUnauthorized(reply, next);
    }

    const credentials = authHeader.replace('Basic ', '');
    let decoded = '';

    try {
      decoded = Buffer.from(credentials, 'base64').toString('utf-8');
    } catch {
      return this.sendUnauthorized(reply, next);
    }

    const parsed = this.credentialRegex.exec(decoded);
    if (!parsed) {
      return this.sendUnauthorized(reply, next);
    }

    const [_, user, pass] = parsed;

    if (user === this.username && pass === this.password) {
      return next();
    }

    return this.sendUnauthorized(reply, next);
  }
}
