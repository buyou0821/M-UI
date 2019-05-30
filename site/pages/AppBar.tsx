import React from 'react';
import { AppBar, Icon, Button } from 'components';

const { IconButton, Typography, ToolBar } = AppBar;

export default () => (
  <AppBar color="primary">
    <IconButton>
      <Icon style={{ color: '#fff', fontSize: 24 }} type="dehaze" />
    </IconButton>
    <Typography>Tyche UI</Typography>
    <ToolBar>
      <Button shape="icon" href="https://github.com/buyou0821/tyche-ui" target="_blank">
        <Icon style={{ color: '#fff', fontSize: 24 }} type="github" />
      </Button>
    </ToolBar>
  </AppBar>
);
