"use strict";

var React = require("react");

var PropTypes = require("prop-types");

var createReactClass = require("create-react-class");

var actioncable = require("actioncable");

var _React$createContext = React.createContext(),
  Provider = _React$createContext.Provider,
  Consumer = _React$createContext.Consumer;

var ActionCableProvider = createReactClass({
  displayName: "ActionCableProvider",
  getInitialState: function getInitialState() {
    if (this.props.cable) {
      return {
        cable: this.props.cable
      };
    } else {
      return {
        cable: actioncable.createConsumer(this.props.url)
      };
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (!this.props.cable && this.state.cable) {
      this.state.cable.disconnect();
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (
      this.props.cable === prevProps.cable &&
      this.props.url === prevProps.url
    ) {
      return;
    } // cable is created by self, disconnect it

    this.componentWillUnmount();
    this.getInitialState();
  },
  render: function render() {
    return React.createElement(
      Provider,
      {
        value: {
          cable: this.state.cable
        }
      },
      this.props.children || null
    );
  }
});
ActionCableProvider.displayName = "ActionCableProvider";
ActionCableProvider.propTypes = {
  cable: PropTypes.object,
  url: PropTypes.string,
  children: PropTypes.any
};
var ActionCableController = createReactClass({
  displayName: "ActionCableController",
  componentDidMount: function componentDidMount() {
    var self = this;
    var _props = this.props;
    var onReceived = _props.onReceived;
    var onInitialized = _props.onInitialized;
    var onConnected = _props.onConnected;
    var onDisconnected = _props.onDisconnected;
    var onRejected = _props.onRejected;
    this.cable = this.props.cable.subscriptions.create(this.props.channel, {
      received: function received(data) {
        onReceived && onReceived(data);
      },
      initialized: function initialized() {
        onInitialized && onInitialized();
      },
      connected: function connected() {
        onConnected && onConnected();
      },
      disconnected: function disconnected() {
        onDisconnected && onDisconnected();
      },
      rejected: function rejected() {
        onRejected && onRejected();
      }
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.cable) {
      this.props.cable.subscriptions.remove(this.cable);
      this.cable = null;
    }
  },
  send: function send(data) {
    if (!this.cable) {
      throw new Error("ActionCable component unloaded");
    }

    this.cable.send(data);
  },
  perform: function perform(action, data) {
    if (!this.cable) {
      throw new Error("ActionCable component unloaded");
    }

    this.cable.perform(action, data);
  },
  render: function render() {
    return this.props.children || null;
  }
});
ActionCableController.displayName = "ActionCableController";
ActionCableController.propTypes = {
  cable: PropTypes.object,
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any
};
var ActionCableConsumer = React.forwardRef(function(props, ref) {
  var Component = createReactClass({
    displayName: "Component",
    render: function render() {
      var _this = this;

      return React.createElement(Consumer, null, function(_ref) {
        var cable = _ref.cable;
        return React.createElement(
          ActionCableController,
          Object.assign(
            {
              cable: cable,
              ref: _this.props.forwardedRef
            },
            _this.props
          ),
          _this.props.children || null
        );
      });
    }
  });
  Component.displayName = "ActionCableConsumer";
  Component.propTypes = {
    onReceived: PropTypes.func,
    onInitialized: PropTypes.func,
    onConnected: PropTypes.func,
    onDisconnected: PropTypes.func,
    onRejected: PropTypes.func,
    children: PropTypes.any
  };
  return React.createElement(
    Component,
    Object.assign(
      {
        forwardedRef: ref
      },
      props
    ),
    props.children || null
  );
});
var ActionCable = createReactClass({
  displayName: "ActionCable",
  componentDidMount: function componentDidMount() {
    console.warn(
      "DEPRECATION WARNING: The <ActionCable /> component has been deprecated and will be removed in a future release. Use <ActionCableConsumer /> instead."
    );
  },
  render: function render() {
    return React.createElement(
      ActionCableConsumer,
      Object.assign({}, this.props),
      this.props.children || null
    );
  }
});
ActionCable.displayName = "ActionCable";
ActionCable.propTypes = {
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any
};
exports.ActionCable = ActionCable;
exports.ActionCableConsumer = ActionCableConsumer;
exports.ActionCableController = ActionCableController;
exports.ActionCableProvider = ActionCableProvider; // Compatible old usage

exports.default = ActionCableProvider;
