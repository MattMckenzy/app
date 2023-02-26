import {useMemo} from 'react';
import {getBasicKeyToByte} from 'src/store/definitionsSlice';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {getSelectedKey} from 'src/store/keymapSlice';
import {Keycap} from './unit-key/keycap';
import {
  calculateKeyboardFrameDimensions,
  CSSVarObject,
  getComboKeyProps,
} from 'src/utils/keyboard-rendering';
import {getExpressions} from 'src/store/macrosSlice';
import styled from 'styled-components';
import {getSelectedTheme} from 'src/store/settingsSlice';
import {CaseInsideBorder} from './case';
import {
  getKeycapSharedProps,
  getKeysKeys,
  getLabels,
  KeyGroupProps,
  KeysKeys,
} from '../n-links/key-group';

const KeyGroupContainer = styled.div<{height: number; width: number}>`
  position: absolute;
  top: ${(p) => CaseInsideBorder * 1.5}px;
  left: ${(p) => CaseInsideBorder * 1.5}px;
`;

const getPosition = (x: number, y: number): [number, number, number] => [
  x - CSSVarObject.keyWidth / 2,
  y - CSSVarObject.keyHeight / 2,
  0,
];
export const KeyGroup: React.VFC<KeyGroupProps<React.MouseEvent>> = (props) => {
  const dispatch = useAppDispatch();
  const selectedKey = useAppSelector(getSelectedKey);
  const selectedTheme = useAppSelector(getSelectedTheme);
  const macroExpressions = useAppSelector(getExpressions);
  const keyColorPalette = props.keyColors ? props.keyColors : selectedTheme;
  const {basicKeyToByte, byteToKey} = useAppSelector(getBasicKeyToByte);
  const macros = useAppSelector((state) => state.macros);
  const {keys, selectedKey: externalSelectedKey} = props;
  const selectedKeyIndex =
    externalSelectedKey === undefined ? selectedKey : externalSelectedKey;
  const keysKeys: KeysKeys<React.MouseEvent> = useMemo(() => {
    return getKeysKeys(props, keyColorPalette, dispatch, getPosition);
  }, [
    keys,
    keyColorPalette,
    props.onKeycapPointerDown,
    props.onKeycapPointerOver,
  ]);
  const labels = useMemo(() => {
    return getLabels(props, macroExpressions, basicKeyToByte, byteToKey);
  }, [keys, props.matrixKeycodes, macros, props.definition]);
  const {width, height} = calculateKeyboardFrameDimensions(keys);
  const elems = useMemo(() => {
    return props.keys.map((k, i) => {
      return (
        <Keycap
          {...getComboKeyProps(k)}
          {...getKeycapSharedProps(
            k,
            i,
            props,
            keysKeys,
            selectedKeyIndex,
            labels,
          )}
        />
      );
    });
  }, [
    keys,
    selectedKeyIndex,
    labels,
    props.pressedKeys,
    props.selectable,
    keyColorPalette,
    props.definition.vendorProductId,
  ]);
  return (
    <KeyGroupContainer height={height} width={width}>
      {elems}
    </KeyGroupContainer>
  );
};