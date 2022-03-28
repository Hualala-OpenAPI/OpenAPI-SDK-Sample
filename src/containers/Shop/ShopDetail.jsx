import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import ShopCatalog from "./components/ShopCatalog";
import CommonListview from "../Main/components/CommonListview";
import ShopCart from "./ShopCart";
import CommonHeader from "../Main/components/MainHeader";
import Config from "../../Config";
import ShopDetailItem from "./ShopDetailItem";
import {getGoodsList} from "../../store/actions/Common";
import "./css/ShopDetail.less";

const ShopDetail = props => {
  const {goodsCatalog, originGoodsList} = props;
  const [listData, updateListData] = useState([]);
  const [headerHeight, updateHeaderHeight] = useState(0);
  const [currentCatalog, updateCurrentCatalog] = useState(null);
  const [listviewRef, updateListviewRef] = useState(null);

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    if (currentCatalog) getCatalogByData();
  }, [currentCatalog]);

  const getItems = () => {
    const {groupId, shopId} = Config.info;
    props.getGoodsList({shopID: shopId, groupID: groupId}, catalogItems => {
      catalogOnChange(catalogItems[0].id);
    });
  };

  const renderListItem = (item, sectionID, rowID) => {
    return item.isActive && item.isOpen ? <ShopDetailItem key={rowID} item={item} /> : null;
  };

  const listenHeaderHeight = ref => {
    if (ref?.clientHeight) {
      updateHeaderHeight(ref.clientHeight);
    }
  };

  const catalogOnChange = id => {
    updateCurrentCatalog(id);
    if (listviewRef) {
      listviewRef.current.scrollTo(0);
    }
  };

  const getCatalogByData = () => {
    const currentItems = originGoodsList.filter(item => item?.catalogId === currentCatalog);
    updateListData(currentItems);
  };

  return (
    <div className="shop-detail" id="shopDetail">
      <CommonHeader title="堂食-点菜" listenHeaderHeight={listenHeaderHeight} />
      <div className="shop-container" style={{height: `calc(100% - ${headerHeight}px)`}}>
        <ShopCatalog data={goodsCatalog} onChange={catalogOnChange} />
        <div className="list-view-box">
          <CommonListview listData={listData} listRow={renderListItem} getListviewRef={ref => updateListviewRef(ref)} />
        </div>
      </div>
      <ShopCart />
    </div>
  );
};
const mapStateToProps = state => {
  return {
    originGoodsList: state.common.get("originGoodsList").toJS(),
    goodsCatalog: state.common.get("goodsCatalog").toJS()
  };
};
const mapDispatchToProps = {
  getGoodsList
};

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(ShopDetail));
