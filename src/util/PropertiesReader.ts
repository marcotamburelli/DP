import { DataNodeProperties } from '../component/DataNode';
import { Binder, BindProperties, DEFAULT_BIND } from '../component/dom/DomBinder';
import { ObservationProperties } from '../event/types';
import { BIND_PROPERTIES, DATA_NODE_PROPERTIES, NATIVE_PROPERTIES } from './const';
import { Properties } from './types';

export class PropertiesReader {
  static create(properties: Properties) {
    return new PropertiesReader(properties);
  }

  dataNodeProperties: DataNodeProperties = {};
  nativeProperties: Properties = {};
  observationProperties: ObservationProperties = {};
  bindProperties: BindProperties = {};

  private constructor(properties: Properties) {
    Object.keys(properties).forEach(key => {
      if (!this.checkObservationProperty(key, properties) && !this.checkBindProperties(key, properties)) {
        this.registerDataNodeProperty(key, properties);
        this.registerAsNative(key, properties);
      }
    });
  }

  private registerDataNodeProperty(key: string, properties: Properties) {
    switch (key.toLowerCase()) {
      case DATA_NODE_PROPERTIES.ID:
        this.dataNodeProperties[DATA_NODE_PROPERTIES.ID] = properties[key];
        break;

      case DATA_NODE_PROPERTIES.NAME:
        this.dataNodeProperties[DATA_NODE_PROPERTIES.NAME] = properties[key];
        break;
    }
  }

  private checkObservationProperty(key: string, properties: Properties) {
    const prop = key.toLowerCase();
    const propValue = properties[key];

    if (prop.startsWith('on') && typeof propValue === 'object') {
      this.observationProperties[prop.substr(2)] = { ...propValue };

      return true;
    }
  }

  private checkBindProperties(key: string, properties: Properties) {
    const prop = key.toLowerCase();
    const propValue = properties[key];

    switch (prop) {
      case BIND_PROPERTIES.BIND:
        this.bindProperties[DEFAULT_BIND] = { ...propValue as Binder<any, any> };

        return true;
    }

    if (typeof propValue === 'object' || propValue.get || propValue.set) {
      this.bindProperties[prop] = { ...propValue as Binder<any, any> };

      return true;
    }

    if (typeof propValue === 'function') {
      this.bindProperties[prop] = { set: propValue };

      return true;
    }
  }

  private registerAsNative(key: string, properties: Properties) {
    const prop = key.toLowerCase();

    switch (prop) {
      case NATIVE_PROPERTIES.TYPE:
        this.nativeProperties[NATIVE_PROPERTIES.TYPE] = properties[key].toLowerCase();
        break;

      default:
        this.nativeProperties[prop] = properties[key];
        break;
    }
  }
}
