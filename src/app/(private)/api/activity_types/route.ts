
import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpException } from "@/app/_libs/dumpException";
import { CreateActivityTypeRequestSchema } from "@/app/_types/ActivityTypeRequest";
import * as activityTypeService from "@/app/_services/activityTypeService";
export const dynamic = "force-dynamic";

/**
