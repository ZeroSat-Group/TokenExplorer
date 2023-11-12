import { GlobalThemeOverrides } from 'naive-ui'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#fca12a',
    primaryColorHover: '#fca12a',
    primaryColorPressed: '#fca121',
    borderColor: 'null'
  },
  Card: {
    colorModal: '#1b1f1e',
    paddingLarge: '0px',
    contentPadding: '0px',
    borderRadius: '16px'
  },
  Form: {
    labelTextColor: '#fff'
  },
  Radio: {
    textColor: '#fff',
    dotColorDisabled: '#28302e'
  },
  Input: {
    textColor: '#fff',
    borderRadius: '6px',
    heightLarge: '30px',
    color: '#1b1f1e',
    colorFocus: 'rgba(7, 9, 8, 1)',
    colorPressed: 'rgba(7, 9, 8, 1)',
    colorDisabled: 'rgba(7, 9, 8, 1)',
    colorFocusError: 'rgba(7, 9, 8, 1)'
  },
  Slider: {
    railColor: 'rgba(255, 255, 255, 0.08)',
    railColorHover: 'rgba(255, 255, 255, 0.2)'
  },
  Switch: {
    railColor: 'rgba(252, 161, 42, 0.2)'
  },
  InputNumber: {
    textColor: '#fff',
    borderRadius: '6px'
  },
  Button: {
    textColor: '#000',
    borderRadiusMedium: '6px'
  },
  Skeleton: {
    color: '#252525',
    colorEnd: '#28302e'
  },
  Divider: {
    color: 'rgab(256, 256, 256, 0.1)'
  },
  Progress: {
    railHeight: '6px',
    railColor: '#1B1F1E',
    textColorLineOuter: '#fff',
    textColorCircle: '#fff'
  },
  Scrollbar: {
    color: '#2b2b2b'
  },
  Dropdown: {
    optionTextColor: '#fff',
    optionTextColorHover: '#fff',
    optionColorActive: '#28302e',
    optionColorHover: '#28302e',
    optionColor: '#28302e',
    color: '#1b1f1e',
    padding: '6px',
    borderRadius: '0 0 6px 6px'
  },
  Pagination: {
    itemTextColorActive: '#fff',
    itemTextColorHover: '#fff',
    itemColorDisabled: '#121615',
    itemBorder: '1px solid #fff',
    itemColorActive: '#fca12a',
    itemBorderDisabled: '1px solid #fff',
    itemColorHover: '#fca121',
    itemTextColor: 'rgba(255, 255, 255, 0.5)',
    buttonBorder: '1px solid #fff',
    buttonBorderPressed: '1px solid #fff',
    buttonBorderHover: '1px solid #fff',
    buttonIconColor: '#fff',
    buttonIconColorHover: '#fff'
  },
  Popover: {
    color: '#28302e',
    textColor: '#fff',
    actionDividerColor: '#1b1f1e',
    buttonColorHover: '#fca121'
  },
  Checkbox: {
    textColor: '#fff'
  },
  DataTable: {
    paginationMargin: '40px 0 0 0',
    thColor: '#121615',
    thTextColor: 'rgba(256, 256, 256, 0.4)',
    thColorHover: '#1b1f1e',
    tdColor: '#121615',
    tdTextColor: '#fff',
    tdColorHover: '#1b1f1e',
    tdPaddingLarge: '10px 20px',
    peers: {
      Empty: {
        textColor: '#ccc'
      },
      Pagination: {
        itemTextColorActive: '#fff',
        itemTextColorHover: '#fff',
        itemColorDisabled: '#121615',
        itemBorder: '1px solid #fff',
        itemColorActive: '#fca12a',
        itemBorderDisabled: '1px solid #fff',
        itemColorHover: '#fca121',
        itemTextColor: 'rgba(255, 255, 255, 0.5)',
        buttonBorder: '1px solid #fff',
        buttonBorderPressed: '1px solid #fff',
        buttonBorderHover: '1px solid #fff',
        buttonIconColor: '#fff',
        buttonIconColorHover: '#fff'
      }
    }
  }
}
