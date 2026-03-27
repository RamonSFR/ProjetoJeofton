import id from "zod/v4/locales/id.js";
import { prisma } from "../../database/prisma";
import { Restaurant } from "@prisma/client";

type RestaurantCreateData = Omit<Restaurant, 'id'|'createdAt'|'updatedAt'>;
type RestaurantUpdateData = Partial<RestaurantCreateData>;

export const create = async (data: RestaurantCreateData): Promise<Restaurant> =>{
    return prisma.restaurant.create({data});
};
export const getAll = async (): Promise<Restaurant[]> => {
    return prisma.restaurant.findMany();

};
export const getById = async (id: number): Promise<Restaurant | null> =>{
    return prisma.restaurant.findUnique({where: {id}});
};
export const update = async (id: number ,data: RestaurantUpdateData): Promise<Restaurant | null> =>{
    return prisma.restaurant.update({where: {id},data});
};
export const remove = async (id: number): Promise<Restaurant | null> =>{
    return prisma.restaurant.delete({where:{id}});
};
export const searchRestaurant = async (searchTerm: string): Promise<Restaurant[]> =>{
    return prisma.restaurant.findMany({
        where: { name: { contains: searchTerm, mode: 'insensitive'} },
        orderBy: { name: 'asc'}
    });
};