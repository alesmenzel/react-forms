import { Component } from 'react';
import PropTypes from 'prop-types';

class WithFocus extends Component {
  state = { focused: false };

  onFocus = () => this.setState({ focused: true });
  onBlur = () => this.setState({ focused: false });

  render() {
    return this.props.children(this.state.focused, this.onFocus, this.onBlur);
  }
}

WithFocus.propTypes = {
  children: PropTypes.any.isRequired,
};

export default WithFocus;
