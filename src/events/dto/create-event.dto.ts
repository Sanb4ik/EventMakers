import {ApiProperty} from "@nestjs/swagger";

export class CreateEventDto {
    @ApiProperty({
        type: String,
        example: "Nestjs",
    })
    title: string;

    @ApiProperty({
        type: String,
        example: "is a framework for building efficient, scalable Node.js server-side applications.",
    })
    description: string;

    @ApiProperty({
        type: String,
        example: '2023-02-08',
    })
    dateOnly: string;

    @ApiProperty({
        type: String,
        example: "10:30",
    })
    timeOnly: string;
}
