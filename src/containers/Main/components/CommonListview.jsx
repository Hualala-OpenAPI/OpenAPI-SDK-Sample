import React, {useEffect, useRef, useState} from "react";
import {ListView} from "antd-mobile";
import "../css/CommonListview.less";

const CommonListview = props => {
  const {listData, listRow, pageSize = 6, useBodyScroll = false, getListviewRef} = props;
  const [dataSource, updateDataSource] = useState(new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}));
  const listViewRef = useRef(null);
  useEffect(() => {
    updateDataSource(dataSource.cloneWithRows({...listData}));
  }, [listData]);
  useEffect(() => {
    if (getListviewRef) {
      getListviewRef(listViewRef);
    }
  }, []);

  return (
    <div className="common-listview">
      <ListView ref={listViewRef} useBodyScroll={useBodyScroll} dataSource={dataSource} renderRow={listRow} pageSize={pageSize} />
    </div>
  );
};

export default React.memo(CommonListview);
