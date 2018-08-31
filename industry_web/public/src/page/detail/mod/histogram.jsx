import React from 'react';
import ReactDOM from 'react-dom';
import { Chart, Geom, Axis, Tooltip, Legend, Coord,Label } from 'bizcharts';

class Histogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.reloadPage = this.reloadPage.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.reloadPage);
  }
  componentWillMount() {
    window.addEventListener('resize', this.reloadPage);
  }

  reloadPage() {
    window.location.reload();
  }
  render() {
    const dataSource = [];
    if (this.props.dataSource) {
      this.props.dataSource.forEach((item, index) => {
        dataSource.push({ genre: item.colname, sold: item.entropy })
      });
    }
    const cols = {
      sold: { alias: " " },
      genre: { alias: " " }
    };
    return (
      <div style={{ width: '100%', position: "relative"}}>
        <Chart height={600} padding={[100, 100, 20, 280]} margin={[80,0,0,0]} data={dataSource} cols={cols} forceFit={true}>
          <Coord type="rect" transpose />
          <Axis name="genre" title={null} />
          <Axis name="sold" visible={false} />
          <Tooltip />
          <Geom type="interval" position="genre*sold" >
          <Label
              content="sold"
              offset={10}
              textStyle={{
                fontSize: 16 // 文本大小
              }}
            />
            </Geom>

        </Chart>
        <div className="factore">因素</div>
        <div className="important">重要性评分</div>
      </div>

    )
  }
}

export default Histogram;
