import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  RefreshControl,
  Animated,
  FlatList,
  Picker
} from 'react-native'

import { connect } from 'react-redux'
import { getList } from '../../redux/action/store.js'

import FooterProgress from '../../component/FooterProgress'

declare var global

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class StoreItem extends React.PureComponent<any, any> {

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    navigation.navigate('StoreTopic', {
      id: rowData.id,
      server: rowData.server,
      title: rowData.title || 'PSN商店',
      rowData
    })
  }

  render() {
    // console.log(rowData)
    const { modeInfo, rowData, ITEM_HEIGHT } = this.props
    const { numColumns = 1 } = modeInfo
    return (
      <TouchableNativeFeedback
        onPress={() => { this._onRowPressed(rowData) }}
        useForeground={true}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View pointerEvents={'box-only'} style={{
          flexDirection: 'row', padding: 5,
          marginVertical: 3.5,
          backgroundColor: modeInfo.backgroundColor,
          marginHorizontal: numColumns === 1 ? 0 : 3.5,
          elevation: 1,
          flex: numColumns === 1 ? -1 : 1,
          justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            marginLeft: -2,
            alignSelf: 'center'
          }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={{
                width: 100,
                height: 100,
                alignSelf: 'center'
              }}
            />
          </View>
          <View style={{ marginLeft: 10, flex: 2, flexDirection: 'column' }}>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={1}
              style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 15 }}>
              {rowData.title}
            </Text>
            <Text>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>类别：</Text>
              <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.type}</Text>
            </Text>
            <Text>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>平台：</Text>
              <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.platform}</Text>
            </Text>
            <Text>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>发行：</Text>
              <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.date}</Text>
            </Text>
            <Text>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>售价：</Text>
              <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.price}</Text>
            </Text>
            <Text>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>备注：</Text>
              <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.comment}</Text>
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

class Store extends Component<any, any> {
  static navigationOptions = {
    tabBarLabel: '商店',
    drawerLabel: '商店'
  }

  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
      isLoadingMore: false,
      server: 'hk',
      ob: 'reledate',
      pf: 'all'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.modeInfo.themeName !== nextProps.screenProps.modeInfo.themeName) {

    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {

    } else {
      this.setState({
        isRefreshing: false,
        isLoadingMore: false
      }, () => {
        // this.props.community.topicPage === 1 && this.flatlist.getNode().scrollToOffset({ offset: 1, animated: true })
        // if (item.topicPage > 1) {
        //   const max = item.topics.length / item.topicPage
        //   const target = max * (item.topicPage - 1)
        //   setTimeout(() => this.flatlist.getNode().scrollToIndex({ index: target, viewPosition: 1, viewOffset: 50, animated: true }))
        //   // console.log(this.contentOffset + 50)
        // }
      })
    }
  }

  flatlist: any = false
  refreshControl: any = false

  onValueChange = (key: string, value: string) => {
    const newState = {}
    newState[key] = value
    this.setState(newState, () => {
      this._onRefresh()
    })
  }

  _renderHeader = () => {
    const { modeInfo } = this.props.screenProps
    return (
      <View style={{
        flex: -1,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingTop: 3,
        backgroundColor: modeInfo.backgroundColor
      }}>
        <Picker style={{
          flex: 1,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择服务器'
          selectedValue={this.state.server}
          onValueChange={this.onValueChange.bind(this, 'server')}>
          <Picker.Item label='港服' value='hk' />
          <Picker.Item label='国服' value='cn' />
          <Picker.Item label='日服' value='jp' />
          <Picker.Item label='美服' value='us' />
        </Picker>
        <Picker style={{
          flex: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择平台'
          selectedValue={this.state.pf}
          onValueChange={this.onValueChange.bind(this, 'pf')}>
          <Picker.Item label='全部' value='all' />
          <Picker.Item label='PSV' value='psvita' />
          <Picker.Item label='PS3' value='ps3' />
          <Picker.Item label='PS4' value='ps4' />
          <Picker.Item label='PSP' value='psp' />
        </Picker>
        <Picker style={{
          flex: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='排序'
          selectedValue={this.state.ob}
          onValueChange={this.onValueChange.bind(this, 'ob')}>
          <Picker.Item label='最近发售' value='reledate' />
          <Picker.Item label='价格升序' value='priceup' />
          <Picker.Item label='价格降序' value='pricedown' />
        </Picker>
      </View>
    )
  }

  componentWillMount() {
    const { reducer } = this.props
    const { searchTitle, registerAfterEach } = this.props.screenProps

    if (reducer.page === 0) {
      this._onRefresh(
        searchTitle
      )
    }
    registerAfterEach({
      index: 8,
      handler: (searchTitle) => {
        this._onRefresh(
          searchTitle
        )
      }
    })
  }

  _onRefresh: any = (searchTitle?) => {
    const { dispatch } = this.props
    // const { circleType } = this.props.screenProps
    const { server, ob,  pf } = this.state
    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
    dispatch(getList(1, {
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle,
        server,
        ob,
        pf
      })
    )
  }

  _loadMoreData = () => {
    const { reducer, dispatch } = this.props
    const { searchTitle } = this.props.screenProps
    const { server, ob,  pf } = this.state
    let page = reducer.page + 1
    dispatch(getList(page, {
        title: searchTitle,
        server,
        ob,
        pf
      })
    )
  }

  _onEndReached = () => {
    if (this.state.isRefreshing || this.state.isLoadingMore) return

    this.setState({
      isLoadingMore: true
    })
    this._loadMoreData()
  }

  ITEM_HEIGHT = 130 + 7

  _renderItem = ({ item: rowData }) => {

    const { modeInfo, navigation } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    return <StoreItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  render() {
    const { reducer } = this.props
    const { modeInfo } = this.props.screenProps
    global.log('Store.js rendered')
    // console.log(reducer.page, reducer.list)
    return (
      <View style={{ backgroundColor: modeInfo.background, flex: 1 }}>
        {this._renderHeader()}
        <AnimatedFlatList style={{
          flex: 1,
          backgroundColor: modeInfo.background
        }}
          ref={flatlist => this.flatlist = flatlist}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo}/>}
          data={reducer.list}
          keyExtractor={(item) => item.onclick}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          numColumns={modeInfo.numColumns}
          key={modeInfo.themeName}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
      </View>
    )
  }

}

function mapStateToProps(state) {
  return {
    reducer: state.store
  }
}

export default connect(
  mapStateToProps
)(Store)
