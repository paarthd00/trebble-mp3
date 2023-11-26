import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
      EmailShareButton,
      FacebookShareButton,
      TwitterShareButton,
} from "react-share";


import {
      EmailIcon,
      FacebookIcon,
      TwitterIcon,
} from "react-share";
import { songType } from '@/db/schema/song';
import { coverArtType } from '@/db/schema/cover-art';
import { deleteSong } from '../actions';
const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'black',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
};

const ITEM_HEIGHT = 48;

export default function SongMenu({ currentSong }: {
      currentSong: {
            songs: songType | null,
            coverArts: coverArtType | null
      }
}) {
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
      const [openModal, setOpenModal] = React.useState(false);
      const openMenu = Boolean(anchorEl);
      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
      };
      const handleOpenModal = () => setOpenModal(true);
      const handleCloseMenu = () => {
            setAnchorEl(null);
      };
      const handleCloseModal = () => setOpenModal(false);
      const handleDeleteSong = async () => {
            handleCloseModal();
            try {
                  const deleteRes = await deleteSong(
                        {
                              "coverArtId": currentSong.coverArts?.id!,
                              "songId": currentSong.songs?.id!
                        }
                  )

                  if (!deleteRes.success) throw new Error(deleteRes.failure)
            } catch (err) {
                  console.error(err);
            }
      }
      const [openShareModal, setShareModal] = React.useState(false);

      const handleCloseShareModal = () => setShareModal(false);

      return (
            <div>
                  <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={openMenu ? 'long-menu' : undefined}
                        aria-expanded={openMenu ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                  >
                        <MoreVertIcon className='text-white' />
                  </IconButton>
                  <Menu
                        id="long-menu"
                        MenuListProps={{
                              'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        PaperProps={{
                              style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                              },
                        }}
                  >
                        <MenuItem key={"delete"} onClick={() => {
                              handleCloseMenu();
                              handleOpenModal();
                        }
                        }>
                              Delete
                        </MenuItem>
                        <MenuItem key={"copy"} onClick={() => {
                              handleCloseMenu();
                              setShareModal(true);
                        }
                        }>
                              Share
                        </MenuItem>
                  </Menu>
                  <Modal
                        keepMounted
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                  >
                        <Box sx={style}>
                              <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                                    Are you sure you want to delete this song
                              </Typography>
                              <Button onClick={handleDeleteSong}>
                                    Yes
                              </Button>
                              <Button onClick={handleCloseModal}>
                                    No
                              </Button>
                        </Box>
                  </Modal>

                  <Modal
                        keepMounted
                        open={openShareModal}
                        onClose={handleCloseShareModal}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                        className='flex m-auto justify-center items-center w-[20rem] h-[10rem] bg-gray-900'
                  >
                        <div className='flex gap-3'>
                              <TwitterShareButton url={currentSong.songs?.songUrl!}>
                                    <TwitterIcon size={32} round={true} />
                              </TwitterShareButton>
                              <FacebookShareButton url={currentSong.songs?.songUrl!} >
                                    <FacebookIcon size={32} round={true} />
                              </FacebookShareButton>
                              <EmailShareButton url={currentSong.songs?.songUrl!} >
                                    <EmailIcon size={32} round={true} />
                              </EmailShareButton>
                        </div>

                  </Modal>
            </div>
      );
}