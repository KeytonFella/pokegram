import { DynamoDB } from "aws-sdk";
import { S2RegionCoverer } from "nodes2ts";
export declare class GeoDataManagerConfiguration {
    static MERGE_THRESHOLD: number;
    tableName: string;
    consistentRead: boolean;
    hashKeyAttributeName: string;
    rangeKeyAttributeName: string;
    geohashAttributeName: string;
    geoJsonAttributeName: string;
    geohashIndexName: string;
    hashKeyLength: number;
    /**
     * The order of the GeoJSON coordinate pair in data.
     * Use false [lat, lon] for compatibility with the Java library https://github.com/awslabs/dynamodb-geo
     * Use true [lon, lat] for GeoJSON standard compliance. (default)
     *
     * Note that this value should match the state of your existing data - if you change it you must update your database manually
     *
     * @type {boolean}
     */
    longitudeFirst: boolean;
    dynamoDBClient: DynamoDB;
    S2RegionCoverer: typeof S2RegionCoverer;
    constructor(dynamoDBClient: any, tableName: string);
}
