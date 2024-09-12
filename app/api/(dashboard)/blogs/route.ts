import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        const categoryId = searchParams.get("categoryId");

        if (!categoryId ||!Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { status: 400 });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found in the database" }), { status: 400 });
        }

        const filter: any = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        };



        const blogs = await Blog.find(filter);

        return new NextResponse(JSON.stringify({ blogs }), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error in fetching blogs" + error.message, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        const categoryId = searchParams.get("categoryId");

        if (!categoryId ||!Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });
        }

        const body = await request.json();
        const { title, description } = body;

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { status: 400 });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found in the database" }), { status: 400 });
        }

        const newBlog = new Blog({ 
            title, 
            description, 
            user: new Types.ObjectId(userId), 
            category: new Types.ObjectId(categoryId),
        });

        await newBlog.save();
        return new NextResponse(JSON.stringify({ message: "Blog created successfully", blog: newBlog }), { status: 200 });
        
    } catch (error: any) {
        return new NextResponse("Error in creating blog" + error.message, { status: 500 });
    }
};