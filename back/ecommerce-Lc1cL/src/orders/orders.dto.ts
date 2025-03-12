import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ProductOrderDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ example: "c4b9f7e4-3d9b-4f78-b75c-0f57a347efcd", description: "UUID del producto" })
    id: string;

    @ApiProperty({ example: 2, description: "Cantidad del producto" })
    @IsNotEmpty()
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ example: "f47ac10b-58cc-4372-a567-0e02b2c3d479", description: "UUID del usuario" })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        type: [ProductOrderDto],
        description: "Lista de productos con sus cantidades",
        example: [
          { id: "c4b9f7e4-3d9b-4f78-b75c-0f57a347efcd", quantity: 2 },
          { id: "a3e5f0c7-8b92-4d74-92de-3bd9cf839d8f", quantity: 1 }
        ]
      })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductOrderDto)
    products: ProductOrderDto[];
}
