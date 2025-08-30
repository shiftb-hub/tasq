
type Props = {
import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpException } from "@/app/_libs/dumpException";
import { UpdateTagRequestSchema } from "@/app/_types/TagRequest";
import * as tagService from "@/app/_services/tagService";
export const dynamic = "force-dynamic";

  params: {
