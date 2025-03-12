import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configDatabase from "./configDatabase";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load:[configDatabase]
        })
    ]
})
export class ConfigModuleRoot {}