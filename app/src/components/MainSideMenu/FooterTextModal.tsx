import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import TermsOfUseText from "./TermsOfUseText";
import AboutText from "./AboutText";
import PrivacyPolicyText from "./PrivacyPolicyText";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export enum FooterTextModalType {
  About,
  Privacy,
  Terms,
}

interface FooterTextModalProps {
  type: FooterTextModalType,
  open: boolean,
  setOpen: (open: boolean) => void,
}

export default function FooterTextModal({ type, open, setOpen }: FooterTextModalProps) {

  function handleClose() {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {type === FooterTextModalType.Terms && 'Terms of Use'}
          {type === FooterTextModalType.About && 'About'}
          {type === FooterTextModalType.Privacy && 'Privacy Policy'}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {type === FooterTextModalType.Terms && <TermsOfUseText/>}
          {type === FooterTextModalType.About && <AboutText/>}
          {type === FooterTextModalType.Privacy && <PrivacyPolicyText/>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}