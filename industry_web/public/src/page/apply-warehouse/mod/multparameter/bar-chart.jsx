import React from 'react';
import ReactDOM from 'react-dom';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { connectAll } from 'common/redux-helpers';

class BarChart extends React.Component{
    constructor(props){
      super(props);
      this.state = {};
    }
    returnDataArr(data){
      const dataSource = [];
      if(data && data.distribution && data.distribution.length > 0){
        data.distribution.forEach((item, index) => {
          dataSource.push({genre:item.range.min, sold: item.value})
        })
      }

      return dataSource;
    }
    tooltipChange(item){
      item.items[0].title = `${this.props.title}:${item.items[0].title}`
    }

    render(){
      const dataSource = this.returnDataArr(this.props.dataSource);
      const cols = {
        sold: { 
          alias: '样本量',
        },
        genre: { alias: this.props.title}
      };
      const title = {
        offset: 70, 
        textStyle: {
          fontSize: '12',
          textAlign: 'center',
          fill: '#999',
        },
        position:'center'
      }
      const tooltipMap = {
        name: '样本量',
        value: ''
      };
      return(
        <div style={{width: '80%',marginTop:"50px"}}>
          <Chart  height={550} data={dataSource} scale={cols} forceFit={true} plotCfg={{margin:[50, 100, 200, 70]}} animate={false}>
            <Axis 
              title={title}
              name="sold" 
              label={{
                autoRotate:false,
                offset:30,
                textStyle: {
                  textAlign: 'center', // 文本对齐方向，可取值为： start center end
                  fill: '#000000', // 文本的颜色
                  fontSize: '12', // 文本大小
                  textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
                } 
              }}
              formatter={(value) => {
                let rex = /\./g;
                if (!rex.test(value)) {
                  return value;
                } else {
                  return null;
                }
              }}
              />
              <Axis 
                title={title}
                name="genre" 
                label={{
                  offset: 10,
                  textStyle: {
                    textAlign: 'start', // 文本对齐方向，可取值为： start center end
                    fill: '#000000', // 文本的颜色
                    fontSize: '12', // 文本大小
                    rotate: 50,
                    textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
                  } 
                }}
              />
              <Tooltip onTooltipChange={(value) => { this.tooltipChange(value)}} map={tooltipMap} showTitle={false}/>
              <Geom type="interval" position="genre*sold" color="genre" tooltip="genre" />
              <Geom type="interval" position="genre*sold" color="genre" color='#B06BEB'/>
           </Chart>
        </div>
      )
    }
}
export default connectAll(BarChart);
