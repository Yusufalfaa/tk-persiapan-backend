import type { SchoolProfile, Mission } from "../generated/prisma/client.js";

export type MissionResponse = {
    id: number;
    content: string;
    order: number;
};


export type SchoolProfileResponse = {
    id: number;
    name: string;
    vision: string;
    address: string;
    googleMapsUrl: string;
    phone: string;
    email: string;
    instagramUrl: string | null;
    videoUrl: string | null;
    missions: MissionResponse[];
    createdAt: Date;
    updatedAt: Date;
};


export type MissionRequest = {
    content: string;
};


export type SchoolProfileUpdateRequest = {
    name?: string | undefined;
    vision?: string | undefined;
    address?: string | undefined;
    googleMapsUrl?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    instagramUrl?: string | null;
    videoUrl?: string | null | undefined;
    missions?: MissionRequest[] | undefined;
};

export function toSchoolProfileResponse(school: SchoolProfile & {missions: Mission[];}): SchoolProfileResponse {
    return {
        id: school.id,
        name: school.name,
        vision: school.vision,
        address: school.address,

        googleMapsUrl: school.googleMapsUrl,

        
        phone: school.phone,
        email: school.email,
        instagramUrl: school.instagramUrl,

        videoUrl: school.videoUrl,

        missions: school.missions.map((mission) => ({
            id: mission.id,
            content: mission.content,
            order: mission.order
        })),

        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
    };
}

export function toSchoolProfileUpdateRequest(school: SchoolProfile & {missions: Mission[];}): SchoolProfileUpdateRequest {
    return {
        name: school.name,
        vision: school.vision,
        address: school.address,

        googleMapsUrl: school.googleMapsUrl,

        phone: school.phone,
        email: school.email,
        instagramUrl: school.instagramUrl,

        videoUrl: school.videoUrl,

        missions: school.missions.map((mission) => ({
            content: mission.content,
            order: mission.order,
        })),
    };
}