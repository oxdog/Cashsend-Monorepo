import { Typography, Colors, Spacings, ThemeManager } from 'react-native-ui-lib'

export const configureTheme = () => {
  Colors.loadColors({
    white: '#ffffff',
    newWhite: '#fdfff5',
    shadowGreen: '#9ecec0',
    deco: '#bedd9a',
    jungleGreen: '#32a37f',
    deepSeaGreen: '#0a6259',
    eggWhite: '#fff4c5',
    goldenTainoi: '#fece63',
    bittersweet: '#fd6f63',
    romantic: '#fec9b4',
    newBlack: '#182b33',
    authBlue: '#4285F4'
  })

  Typography.loadTypographies({
    logotextLarge: {
      fontFamily: 'omnes-semibold-italic',
      lineHeight: 36,
      fontSize: 36
    },
    logotextRegular: {
      fontFamily: 'omnes-semibold-italic',
      lineHeight: 28,
      fontSize: 28
    },
    h1: {
      fontFamily: 'omnes-extraLight-italic',
      lineHeight: 32,
      fontSize: 28
    },
    h2: {
      fontFamily: 'omnes-extraLight-italic',
      lineHeight: 24,
      fontSize: 20
    },
    regular: { fontFamily: 'bieder-book', lineHeight: 18, fontSize: 14 },
    semibold: { fontFamily: 'bieder-semibold', lineHeight: 18, fontSize: 14 },
    thin: {
      fontFamily: 'bieder-thin',
      lineHeight: 18,
      fontSize: 14
    }
  })

  Spacings.loadSpacings({
    // page: isSmallScreen ? 16 : 20
    page: 20
  })

  ThemeManager.setComponentTheme('Button', (props: any, context: any) => ({
    backgroundColor: props.outline ? Colors.newWhite : Colors.jungleGreen,
    outlineColor: props.outline ? Colors.jungleGreen : Colors.newWhite,
    color: props.outline ? Colors.jungleGreen : Colors.newWhite,
    borderColor: props.outline ? Colors.jungleGreen : undefined
  }))

  ThemeManager.setComponentTheme('TextField', (props: any, context: any) => ({
    borderColor: props.outline ? Colors.jungleGreen : undefined,
    color: Colors.grey20,
    errorColor: Colors.bitterSweet,
    titleColor: Colors.jungleGreen,
    underlineColor: !props.error ? Colors.jungleGreen : Colors.bitterSweet,
    useTopErrors: true,
    floatingPlaceholderColor: Colors.green10,
    maxLength: 100,
    fontFamily: 'bieder-book'
  }))

  ThemeManager.setComponentTheme('Text', (props: any, context: any) => {
    const propKeys = Object.keys(props)
    const colorKeys = Object.keys(Colors)
    const typographKeys = Object.keys(Typography)

    const isAnyPropAColor = colorKeys.some((key) => propKeys.indexOf(key) >= 0)
    const isAnyPropATypography = typographKeys.some(
      (key) => propKeys.indexOf(key) >= 0
    )

    let generatedProps = { ...props }

    if (!isAnyPropAColor) {
      generatedProps = {
        ...generatedProps,
        color: Colors.newBlack
      }
    }

    if (!isAnyPropATypography) {
      generatedProps = {
        ...generatedProps,
        fontFamily: 'bieder-book',
        lineHeight: 18,
        fontSize: 14
      }
    }

    // console.log('props', generatedProps)

    return generatedProps
  })

  ThemeManager.setComponentTheme('Switch', (props: any, context: any) => ({
    onColor: Colors.jungleGreen,
    offColor: Colors.grey40
  }))

  // ThemeManager.setComponentTheme('View', {
  //   backgroundColor: Colors.newWhite
  // })
}
