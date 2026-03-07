import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>("GITHUB_CLIENT_ID")!,
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET")!,
      callbackURL: "http://localhost:4001/api/auth/github/callback",
      scope: ["user:email"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { username, emails, photos, id } = profile;

    const user = {
      githubId: id,
      username: username,
      email: emails && emails[0] ? emails[0].value : null,
      avatarUrl: photos && photos[0] ? photos[0].value : null,
      accessToken,
    };

    done(null, user);
  }
}
