import {nanoid} from "nanoid";
import Http from "./Http";

export default class BaseService {
  static request(options = {}) {
    const {url, method = "POST", params, data, formData} = options;

    const httpOptions = {url, method};

    if ("params" in options) {
      httpOptions["params"] = this.filterParams(params);
    }
    if ("data" in options) {
      httpOptions["data"] = this.filterParams(data);
    }

    if ("formData" in options) {
      formData.append("traceId", nanoid());
      httpOptions["data"] = formData;
    }
    return Http(httpOptions);
  }

  static filterParams(params) {
    if (typeof params === "string") {
      try {
        const paramsObj = JSON.parse(params);
        paramsObj.traceId = nanoid();
        return JSON.stringify(paramsObj);
      } catch (e) {
        return params;
      }
    }
    if (typeof params === "object")
      return {
        ...params,
        traceId: nanoid()
      };
  }
}
