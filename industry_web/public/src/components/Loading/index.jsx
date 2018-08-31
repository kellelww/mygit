import React,{Component} from 'react'
import { connectAll } from 'common/redux-helpers';

class Loading extends Component{
  render(){
    const {children} = this.props
    return (
      <div className="loading">{children}</div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
  }
}

export default connectAll(Loading)
