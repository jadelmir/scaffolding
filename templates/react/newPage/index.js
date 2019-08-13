import React ,{ Component } from 'react'
import { connect } from 'react-redux'
import {TEST } from './actions'


class SelectPage extends Component {
    render() {
        return (
           <div>
                this need to be replaced
           </div>

        );
    }
}
const mapStateToProps = ({[FILENAME]}) => {
    const {}=[FILENAME]

return {  }
}

const mapDispatchToProps = {
    
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectPage)