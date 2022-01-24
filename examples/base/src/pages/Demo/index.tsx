import React from 'react'
import { Button, Dropdown, Menu } from 'uiw'
import { useDispatch } from 'react-redux'
import { Dispatch } from '@uiw-admin/models'
import { ProTable, useTable } from '@uiw-admin/components'
import Detail from './Detail'

const Demo = () => {
  const dispatch = useDispatch<Dispatch>()

  const updateData = (payload: any) => {
    dispatch({
      type: 'demo/updateState',
      payload
    })
  }

  const table = useTable('/api/getData', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data.total,
        data: data.data
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, searchValues) => {
      return {
        page: pageIndex,
        pageSize: 10,
        data: searchValues
      }
    }
  })

  // 操作
  function handleEditTable(type: string, record: any) {
    updateData({
      isView: type === 'view',
      tableType: type
    })
    if (type === 'add') {
      updateData({ drawerVisible: true, queryInfo: {} })
    }
    if (type === 'edit' || type === 'view') {
      dispatch({
        type: 'demo/selectById',
        payload: { id: record?.id }
      })
    }
  }

  const menu = (
    <div>
      <Menu bordered style={{ maxWidth: 200 }}>
        {
          [
            { label: '搜索', value: "search", icon: "search", onClick: () => table?.onSearch() },
            { label: '重置', value: 'reset', icon: "reload", onClick: () => console.log('点击重置') }
          ].map((item, idx) => <Menu.Item icon={item?.icon} onClick={item?.onClick} key={idx} text={item.label} />)
        }
      </Menu>
    </div>
  );

  return (
    <React.Fragment>
      <ProTable
        searchBtns={[
          {
            render: (
              <Dropdown menu={menu} trigger="click" placement="bottomRight">
                <Button type="primary">自定义下拉</Button>
              </Dropdown>
            )
          },
          { label: '点我', onClick: () => null }
        ]}
        operateButtons={[
          {
            label: '新增',
            type: 'primary',
            onClick: handleEditTable.bind(this, 'add')
          },
          {
            render: <Button type="primary">自定义render</Button>
          },
        ]}
        columns={[
          {
            title: '姓名',
            key: 'name',
            props: {
              widget: 'input',
              // 组件属性
              widgetProps: {
                preIcon: 'user',
                placeholder: '输入用户名'
              }
            }
          },
          {
            title: '年龄',
            key: 'age',
            props: {
              widget: 'select',
              option: [
                { label: '20', value: 20 },
                { label: '10', value: 10 }
              ]
            }
          },
          {
            title: '地址',
            key: 'info'
          },
          {
            title: '操作',
            key: 'edit',
            width: 98,
            render: (text: any, key: any, rowData: any) => (
              <div>
                <Button
                  size="small"
                  type="danger"
                  onClick={handleEditTable.bind(this, 'edit', rowData)}
                >
                  编辑
                </Button>
                <Button
                  size="small"
                  type="success"
                  onClick={handleEditTable.bind(this, 'view', rowData)}
                >
                  查看
                </Button>
              </div>
            )
          }
        ]}
        table={table}
      />
      <Detail updateData={updateData} />
    </React.Fragment>
  )
}
export default Demo
