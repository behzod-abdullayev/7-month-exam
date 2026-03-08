import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Kompaniyaga baho berish" })
  create(@Body() dto: CreateReviewDto, @CurrentUser() currentUser: User) {
    return this.reviewsService.create(dto, currentUser);
  }

  @Get("company/:companyId")
  @ApiOperation({ summary: "Kompaniya baholari" })
  @ApiParam({ name: "companyId", type: String })
  findByCompany(
    @Param("companyId", ParseUUIDPipe) companyId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ) {
    return this.reviewsService.findByCompany(companyId, +page, +limit);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Bahoni o'chirish" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    return this.reviewsService.remove(id, currentUser);
  }
}
