import {
  Avatar,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import React from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { LottoGame } from "../../utils/constants";
import { getDefaultIcon, getLottoIcon } from "../../utils/icon-helper";
import { LottoResultsFilterState } from "../../utils/types";

interface FilterListProps {
  filterState: LottoResultsFilterState;
}

export default function FilterList({ filterState }: FilterListProps) {
  const { filter, setFilter } = filterState;
  const [lottoGamesExpand, setLottoGamesExpand] = React.useState(true);

  const filterListItem: {
    name: LottoGame | string;
    icon?: string;
    checked: boolean;
    onChange: () => void;
  }[] = [
    {
      name: LottoGame.ULTRA,
      onChange: () => setFilter({ ...filter, ultra: !filter.ultra }),
      checked: filter.ultra,
    },
    {
      name: LottoGame.MEGA,
      onChange: () => setFilter({ ...filter, mega: !filter.mega }),
      checked: filter.mega,
    },
    {
      name: LottoGame.SUPER,
      onChange: () => setFilter({ ...filter, super: !filter.super }),
      checked: filter.super,
    },
    {
      name: LottoGame.LOTTO,
      onChange: () => setFilter({ ...filter, lotto: !filter.lotto }),
      checked: filter.lotto,
    },
    {
      name: LottoGame.GRAND,
      onChange: () => setFilter({ ...filter, grand: !filter.grand }),
      checked: filter.grand,
    },
    {
      name: LottoGame.LOTTO_6D,
      onChange: () => setFilter({ ...filter, lotto6D: !filter.lotto6D }),
      checked: filter.lotto6D,
    },
    {
      name: LottoGame.LOTTO_4D,
      onChange: () => setFilter({ ...filter, lotto4D: !filter.lotto4D }),
      checked: filter.lotto4D,
    },
    {
      name: "3D Lotto",
      onChange: () => setFilter({ ...filter, swertres3D: !filter.swertres3D }),
      checked: filter.swertres3D,
    },
    {
      name: "2D Lotto",
      onChange: () => setFilter({ ...filter, swertres2D: !filter.swertres2D }),
      checked: filter.swertres2D,
    },
  ];

  function toggleLottoGames() {
    setLottoGamesExpand(!lottoGamesExpand);
  }

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={toggleLottoGames}>
          <ListItemIcon>
            <FilterListIcon />
          </ListItemIcon>
          <ListItemText primary="Filter" />
          {lottoGamesExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={lottoGamesExpand} timeout="auto" unmountOnExit>
        <List dense component="div" disablePadding>
          {filterListItem.map((filterItem) => {
            const labelId = `filter-checkbox-list-secondary-label-${filterItem.name}`;
            return (
              <ListItem
                key={filterItem.name}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={(event, checked) => filterItem.onChange()}
                    checked={filterItem.checked}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
                sx={{ pl: 2 }}
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={getDefaultIcon()}
                      src={getLottoIcon(filterItem.name)}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={filterItem.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
}
