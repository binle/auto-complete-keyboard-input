import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, TouchableOpacity, Image, ListView,
  Keyboard,
  StyleSheet,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';

let deviceSize = Dimensions.get('window');
const ListViewDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

import styles from './auto-complete.style';

export default class AutoCompleteKeyboardInput extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
    this.onKeyboardWillChangeFrame = this.onKeyboardWillChangeFrame.bind(this);
    this.onKeyboardDidChangeFrame = this.onKeyboardDidChangeFrame.bind(this);

    this.onChangeText = this.onChangeText.bind(this);
    this.onEndEditing = this.onEndEditing.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.selectText = this.selectText.bind(this);

    this.doDisplayExtensionArea = this.doDisplayExtensionArea.bind(this);
    this.doHideExtensionArea = this.doHideExtensionArea.bind(this);

    this.state = {
      dataSource: this.props.dataSource||[],
      opacity: new Animated.Value(9),
      extBottom: new Animated.Value(deviceSize.height),
      keyboardHeight: 0,
      inputtedText: '',
    }
  }
  // ==========================================================================================
  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: nextProps.dataSource || []});
  }

  componentDidMount() {
    this.keyboardWillShow = Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
    this.keyboardDidShow = Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
    this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
    this.keyboardDidHide = Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)
    this.keyboardWillChangeFrame = Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardWillChangeFrame)
    this.keyboardDidChangeFrame = Keyboard.addListener('keyboardDidChangeFrame', this.onKeyboardDidChangeFrame)
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    this.keyboardWillShow.remove();
    this.keyboardDidShow.remove();
    this.keyboardWillHide.remove();
    this.keyboardDidHide.remove();
    this.keyboardWillChangeFrame.remove();
    this.keyboardDidChangeFrame.remove();
  }
  // ==========================================================================================
  doDisplayExtensionArea() {
    Animated.parallel([
      Animated.spring(this.state.opacity, {
        toValue: 1,
        duration: 2000,
      }),
      Animated.spring(this.state.extBottom, {
        toValue: this.state.keyboardHeight,
        duration: 2000,
      }),
    ]);
  }
  doHideExtensionArea() {
    Animated.parallel([
      Animated.spring(this.state.opacity, {
        toValue: 0,
        duration: 2000,
      }),
      Animated.spring(this.state.extBottom, {
        toValue: deviceSize.height,
        duration: 2000,
      }),
    ]);
  }
  // ==========================================================================================
  onKeyboardWillShow(keyboardEvent) {
    if (this.props.onKeyboardWillShow) {
      this.props.onKeyboardDidShow(keyboardEvent);
    }
  }
  onKeyboardDidShow(keyboardEvent) {
    this.doDisplayExtensionArea();
    this.setState({ keyboardHeight: keyboardEvent.endCoordinates.height });
    if (this.props.onKeyboardDidShow) {
      this.props.onKeyboardDidShow(keyboardEvent);
    }
  }
  onKeyboardWillHide(keyboardEvent) {
    this.doHideExtensionArea();
    this.setState({ keyboardHeight: 0 });
    if (this.props.onKeyboardWillHide) {
      this.props.onKeyboardWillHide(keyboardEvent);
    }
  }
  onKeyboardDidHide(keyboardEvent) {
    if (this.props.onKeyboardDidHide) {
      this.props.onKeyboardDidHide(keyboardEvent);
    }
  }
  onKeyboardWillChangeFrame(keyboardEvent) {
    if (this.props.onKeyboardWillChangeFrame) {
      this.props.onKeyboardWillChangeFrame(keyboardEvent);
    }
  }
  onKeyboardDidChangeFrame(keyboardEvent) {
    if (this.props.onKeyboardDidChangeFrame) {
      this.props.onKeyboardDidChangeFrame(keyboardEvent);
    }
  }

  onChangeText(text) {

  }
  onEndEditing() {

  }
  onKeyPress() {
    if (!this.state.dataSource || this.state.dataSource.length ===0) {
      return;
    }
    //TODO
  }
  selectText(text) {

  }
  // ==========================================================================================
  showKeyboardInput(defaultValue) {
    if (!this.mounted) {
      return setTimeout(() => {
        this.showKeyboardInput(defaultValue);
      }, 200);
    }
    this.setState({inputtedText: defaultValue});
    this.textInputElement.focus();
  }
  hideKeyboardInput() {
    Keyboard.dismiss();
  }
  // ==========================================================================================
  render() {
    return (
      <View style={[styles.extArea, { zIndex: this.props.zIndexExt || 100, bottom: this.state.extBottom, opacity: this.state.opacity }]}>
        <View style={styles.inputArea}>
          <TextInput style={[styles.textInputStyle]}
            ref={r=> this.textInputElement = r}
            onChangeText={this.onChangeText}
            onEndEditing={this.onEndEditing}
            onKeyPress={this.onKeyPress}
            value={this.state.inputtedText}
            autoCorrect={this.props.autoCorrect || false}
            caseSensitive={!!this.props.caseSensitive}
          />
        </View>
        <View style={styles.selectionArea}>
          <ListView style={this.selectionList}
             showsHorizontalScrollIndicator={false}
             keyboardShouldPersistTaps="handled"
             horizontal={true}
             dataSource={ListViewDataSource.cloneWithRows(this.state.dataSource)}
             enableEmptySections={true}
             renderRow={(text) => {
              return (<TouchableOpacity style={styles.selectionItem}  onPress={this.selectText}>
                <Text style={styles.selectionItemText}>{text}</Text>
              </TouchableOpacity>)
             }}
          />
        </View>
      </View>
    );
  }
}

AutoCompleteKeyboardInput.propTypes = {
  onKeyboardWillShow: PropTypes.func,
  onKeyboardDidShow: PropTypes.func,
  onKeyboardWillHide: PropTypes.func,
  onKeyboardDidHide: PropTypes.func,
  onKeyboardWillChangeFrame: PropTypes.func,
  onKeyboardDidChangeFrame: PropTypes.func,

 

  autoCorrect: PropTypes.bool,
  caseSensitive: PropTypes.bool,
  dataSource: PropTypes.array,
  zIndexExt: PropTypes.number,
};