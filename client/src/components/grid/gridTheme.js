import { themeQuartz } from 'ag-grid-community';

export const gridTheme = themeQuartz.withParams({
  fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: 13,
  foregroundColor: '#3c4858',
  backgroundColor: '#ffffff',
  borderRadius: 0,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
  headerFontSize: 13,
  headerFontWeight: 400,
  headerTextColor: '#9c27b0',
  headerBackgroundColor: '#ffffff',
  rowBorder: { color: '#eeeeee' },
  rowHoverColor: 'rgba(156, 39, 176, 0.04)',
  selectedRowBackgroundColor: 'rgba(156, 39, 176, 0.12)',
  accentColor: '#9c27b0',
});
