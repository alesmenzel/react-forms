import { Component } from 'react';
import PropTypes from 'prop-types';

class WithFocus extends Component {
  state = { focused: false };

  onFocus = () => this.setState({ focused: true });

  onBlur = () => this.setState({ focused: false });

  render() {
    const { children } = this.props;
    const { focused } = this.state;

    return children(focused, this.onFocus, this.onBlur);
  }
}

WithFocus.propTypes = {
  children: PropTypes.any.isRequired,
};

export default WithFocus;
