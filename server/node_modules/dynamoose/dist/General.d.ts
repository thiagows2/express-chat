import { Item } from "./Item";
import { Model } from "./Model";
export declare type CallbackType<R, E> = (error?: E | null, response?: R) => void;
export declare type ObjectType = {
    [key: string]: any;
};
export declare type FunctionType = (...args: any[]) => any;
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type KeyObject = {
    [attribute: string]: string | number;
};
export declare type InputKey = string | number | KeyObject;
interface ModelItemConstructor<T extends Item> {
    /**
     * In order to create a new item you just pass in your object into an instance of your model.
     *
     * ```js
     * const User = dynamoose.model("User", {"id": Number, "name": String});
     * const myUser = new User({
     * 	"id": 1,
     * 	"name": "Tim"
     * });
     * console.log(myUser.id); // 1
     *
     * // myUser is now an item instance of the User model
     * ```
     */
    new (object: {
        [key: string]: any;
    }): T;
    Model: Model<T>;
}
export declare type ModelType<T extends Item> = T & Model<T> & ModelItemConstructor<T>;
export interface ItemArray<T> extends Array<T> {
    populate: () => Promise<ItemArray<T>>;
    toJSON: () => ObjectType[];
}
export declare enum SortOrder {
    /**
     * Sort in ascending order. For example: 1, 2, 3.
     */
    ascending = "ascending",
    /**
     * Sort in descending order. For example: 3, 2, 1.
     */
    descending = "descending"
}
export {};
