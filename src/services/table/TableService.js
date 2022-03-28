import BaseService from "../BaseService";

export default class TableService extends BaseService {
  static getStatus(data = {}) {
    const url = "/order/senderQueryMsg";
    return this.request({url, data});
  }

  static show(data = {}) {
    const url = "/order/queryTableMsg";
    return this.request({url, data});
  }
}
