import { DataNodeProperties } from '../component/DataNode';
import { BindProperties } from '../component/dom/DomBinder';
import { ObservationProperties } from '../event/types';
import { Properties } from './types';
export declare class PropertiesReader {
    static create(properties: Properties): PropertiesReader;
    dataNodeProperties: DataNodeProperties;
    nativeProperties: Properties;
    observationProperties: ObservationProperties;
    bindProperties: BindProperties;
    private constructor();
    private registerDataNodeProperty(key, properties);
    private checkObservationProperty(key, properties);
    private checkBindProperties(key, properties);
    private registerAsNative(key, properties);
}
