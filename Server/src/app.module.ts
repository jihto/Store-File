import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common'; 
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces";
import { AuthMiddleware } from './middleware/auth.middleware';
import { RepositoryModule } from './repository/repository.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FolderModule } from './folder/folder.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { UsersService } from './users/services/users/users.service';
import { UsersController } from './users/controllers/users/users.controller';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    AuthModule, 
    UserModule,
    FolderModule,
    RepositoryModule,
    MongooseModule.forRoot(
      // 'mongodb+srv://pnjihto:5HeAhD27BghPUAh2@cluster0.swes1vh.mongodb.net/chat-app?retryWrites=true&w=majority'
      'mongodb://127.0.0.1:27017/chat-app'
    ),
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule
  ], 
  providers:[
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, 
    },
    UsersService, 
  ], controllers: [UsersController]
})
export class AppModule implements NestModule
{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes("repository", "folder", "user"); //applies middleware to all routes
        // consumer
        //     .apply()
        //     .forRoutes('*'); // applies JWT authentication middleware to all routes
    }
  }