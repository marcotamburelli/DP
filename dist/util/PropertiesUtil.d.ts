import { DataNodeProperties } from '../component/DataNode';
import { ComponentGenerator } from '../component/ListContainer';
import { ObservationProperties } from '../event/types';
import { Properties } from './types';
export declare namespace PropertiesUtil {
    function getDataNodeProperties(properties: Properties): DataNodeProperties;
    function getTransformer(properties: Properties): ((value: string) => number) | ((value: string) => string);
    function getGenerator<M>(properties: Properties): ComponentGenerator<M>;
    function getStyleProperties(properties: Properties): {
        class: any;
        style: any;
    };
    function getNativeProperties(properties: Properties): Properties;
    function getObservationProperties(properties: Properties): ObservationProperties;
}
