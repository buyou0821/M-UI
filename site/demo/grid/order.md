## Flex 排序 

使用`Col`元素的`order`属性改变元素的排序。

<!--start-code-->

```jsx
const grid = (
  <div>
    <Row type="flex">
      <Col span={6} order={4}>
        1 col-order-4
      </Col>
      <Col span={6} order={3}>
        2 col-order-3
      </Col>
      <Col span={6} order={2}>
        3 col-order-2
      </Col>
      <Col span={6} order={1}>
        4 col-order-1
      </Col>
    </Row>
  </div>
);
ReactDOM.render(grid);
```

<!--end-code-->
