import * as DynamoDB from "@aws-sdk/client-dynamodb";
export declare type AttributeMap = {
    [key: string]: DynamoDB.AttributeValue;
};
export declare type ExpressionAttributeNameMap = {
    [key: string]: string;
};
export declare type ExpressionAttributeValueMap = {
    [key: string]: DynamoDB.AttributeValue;
};
declare global {
    interface Blob {
    }
    interface File {
    }
}
declare global {
    interface ReadableStream {
    }
}
export declare type AnySimpleValue = string | number | symbol;
export declare type AnySimpleObject = Record<string, AnySimpleValue>;
export declare type ArrayItemsMerger = <T extends AnySimpleObject = AnySimpleObject>(target: T[], source: T[]) => T[];
