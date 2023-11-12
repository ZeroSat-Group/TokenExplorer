import { DataTableColumns, NProgress } from 'naive-ui'
import TextLink from '~/components/TextLink.vue'
import InscriptionNumber from '~/components/InscriptionNumber.vue'
import { shortAddress, formatNumber } from '~/utils/helpers'
import SellBuyButton from '~/blocks/sell/SellBuyButton.vue'
import CreateDateWithStatus from '~/components/CreateDateWithStatus.vue'
import ProposalProgress from '~/components/ProposalProgress.vue'
import VoteMessage from '~/components/VoteMessage.vue'
import { Orc20ProposeInfo } from 'types/api'

export const orcCashColumns: DataTableColumns<any> = [
  {
    title: 'TICKER',
    key: 'tokenInfoTicker',
    width: 150,
    ellipsis: true,
    render(row) {
      const { path } = useApi()
      return h(TextLink, {
        to: path + '/token/' + row.tokenInfoInscriptionNumber,
        text: row.tokenInfoTicker
      })
    }
  },
  {
    title: 'PROTOCOL',
    key: 'tokenInfoProtocol',
    align: 'center',
    width: 140,
    defaultFilterOptionValues: [],
    render(row) {
      return row.tokenInfoProtocol?.toUpperCase() ?? 'ORC-CASH'
    },
    filterOptions: [
      {
        label: 'ORC-CASH',
        value: 'orc-cash'
      },
      {
        label: 'BRC-20',
        value: 'brc-20'
      },
      {
        label: 'ORC-20',
        value: 'orc-20'
      }
    ],
    filter: true
  },
  {
    title: 'TOKEN ID',
    key: 'tokenInfoOrc20Id',
    align: 'center',
    width: 120,
    defaultFilterOptionValues: [],
    filterOptions: [
      {
        label: 'Only #1 token',
        value: '1'
      }
    ],
    filter: true
  },
  {
    title: 'INSCRIPTION #',
    key: 'tokenInfoInscriptionNumber',
    width: 180,
    sorter: true,
    align: 'center',
    render(row: any) {
      return h(InscriptionNumber, {
        inscriptionNumber: row.tokenInfoInscriptionNumber,
        inscriptionID: row.tokenInfoInscriptionID
      })
    }
  },
  {
    title: 'DEPLOY TIME',
    key: 'tokenInfoDeployTimes',
    width: 200,
    sorter: true,
    align: 'center',
    render(row) {
      return formatTime(row.tokenInfoDeployTimes)
    }
  },
  {
    title: 'PROGRESS',
    key: 'tokenInfoProgress',
    width: 160,
    sorter: true,
    render(row) {
      return h(NProgress, {
        type: 'line',
        color: '#fca121',
        percentage: Number(formatNumber(row.tokenInfoProgress * 100, 2)),
        indicatorTextColor: '#ffffff',
        railColor: '#3F3E28'
      })
    }
  },
  {
    title: 'UPGRADABLE',
    key: 'tokenInfoUpgradable',
    align: 'center',
    width: 150,
    render(row) {
      return row.tokenInfoUpgradable ? 'Yes' : 'No'
    },
    defaultFilterOptionValues: [],
    filterOptions: [
      {
        label: 'Yes',
        value: 'yes'
      },
      {
        label: 'No',
        value: 'no'
      }
    ],
    filter: true
  },
  {
    title: 'HOLDERS',
    key: 'tokenInfoHolders',
    align: 'center',
    width: 120,
    // sorter: true,
    render(row) {
      return formatNumber(row.tokenInfoHolders, 0)
    }
  },
  {
    title: 'TRANSACTIONS',
    width: 160,
    align: 'center',
    key: 'tokenInfoTransactions',
    sorter: true,
    render(row) {
      return formatNumber(row.tokenInfoTransactions, 0)
    }
  }
]

export const orc20Columns: DataTableColumns<any> = [...orcCashColumns].filter(
  (item) => !['tokenInfoProtocol'].includes((item as any).key)
)

const sellStatus = {
  0: 'Active',
  1: 'Filled',
  2: 'Expried'
}
export const sellColumns: DataTableColumns<any> = [
  {
    title: 'TICKER',
    key: 'sellOrderTicker',
    width: 150,
    ellipsis: true,
    render(row) {
      return h(TextLink, {
        to: '/token/' + row.sellOrderTokenInscriptionId,
        text: row.sellOrderTicker
      })
    }
  },
  {
    title: 'TOKEN ID',
    key: 'sellOrderTokenId',
    align: 'center',
    width: 120,
    defaultFilterOptionValues: [],
    filterOptions: [
      {
        label: 'Only #1 token',
        value: '1'
      }
    ],
    filter: true
  },
  {
    title: 'TOTAL',
    key: 'sellOrderAmount',
    align: 'center',
    sorter: true,
    width: 150,
    render(row) {
      return formatNumber(row.sellOrderAmount, -1)
    }
  },
  {
    title: 'AMOUNT LEFT',
    key: 'sellOrderSoldAmount',
    width: 150,
    sorter: true,
    align: 'center',
    render(row) {
      return formatNumber(Number(row.sellOrderAmountLeft ?? '0'), -1)
    }
  },
  {
    title: 'LIMIT',
    key: 'sellOrderLim',
    width: 150,
    align: 'center',
    render(row) {
      return formatNumber(Number(row.sellOrderLim ?? '0'), -1)
    }
  },
  {
    title: 'PRICE(Sats/Token)',
    key: 'sellOrderPrice',
    width: 180,
    sorter: true,
    align: 'center',
    render(row) {
      return formatNumber(row.sellOrderPrice, -1)
    }
  },
  {
    title: 'SELLER',
    key: 'sellOrderSeller',
    width: 160,
    align: 'center',
    render(row) {
      return h(TextLink, {
        to: `/sell?seller=${row.sellOrderSeller}`,
        text: shortAddress(row.sellOrderSeller)
      })
    }
  },
  {
    title: 'STATUS',
    key: 'sellOrderStatus',
    width: 150,
    align: 'center',
    filterMultiple: false,
    render(row) {
      const color = () => {
        switch (row.sellOrderStatus) {
          case 0:
            return 'rgb(101, 195, 130)'
          case 1:
            return 'rgb(213, 149, 61)'
          case 2:
            return 'rgb(214, 80, 73)'
        }
      }

      return h(TextLink, {
        to: '/sell/token/' + row.sellOrderSellOrderId,
        style: {
          color: color()
        },
        text: (sellStatus as { [key: number]: string })[
          row.sellOrderStatus as number
        ]
      })
    },
    filterOptions: Object.keys(sellStatus).map((k: string) => {
      return {
        label: (sellStatus as { [key: number]: string })[Number(k)],
        value: k
      }
    }),
    filter: true
  },
  {
    title: 'BUY',
    key: 'buy',
    width: 150,
    align: 'center',
    render: (row) => {
      return h(SellBuyButton, {
        tokenInfo: { ...row },
        disabled: row.sellOrderStatus !== 0
      })
    }
  },
  {
    title: 'ACTIVATION BLK.',
    key: 'sellOrderActivationBlock',
    width: 180,
    sorter: true,
    align: 'center',
    render(row) {
      return row.sellOrderActivationBlock
    }
  },
  {
    title: 'EXPIRE BLK.',
    key: 'sellOrderExpire',
    width: 150,
    sorter: true,
    align: 'center',
    render(row) {
      return row?.sellOrderExpire === 'never'
        ? row?.sellOrderExpire.toUpperCase()
        : row.sellOrderExpire
    }
  },
  {
    title: 'WHITELSTED',
    key: 'sellOrderHasWhiteListed',
    width: 150,
    align: 'center',
    render(row) {
      return row.sellOrderHasWhiteListed &&
        row.sellOrderHasWhiteListed === 'yes'
        ? 'Yes'
        : 'No'
    },
    filterMultiple: false,
    filterOptions: [
      {
        label: 'Yes',
        value: 'yes'
      },
      {
        label: 'No',
        value: 'no'
      }
    ],
    filter: true
  },
  {
    title: 'PROGRESS',
    key: 'sellOrderProgress',
    width: 160,
    sorter: true,
    align: 'center',
    render(row) {
      return h(NProgress, {
        type: 'line',
        color: '#fca121',
        percentage: Number(
          formatNumber(Number(row.sellOrderProgress ?? '0') * 100, 2)
        ),
        indicatorTextColor: '#ffffff',
        railColor: '#3F3E28'
      })
    }
  }
]

export const leaderboardColumns: DataTableColumns<any> = [
  {
    title: 'RANK',
    key: 'rank',
    sorter: true,
    align: 'center'
  },
  {
    title: 'INSCRIBER',
    key: 'address',
    align: 'center',
    render(row) {
      return h(TextLink, {
        to: '/leaderboard/address/' + row.address,
        text: shortAddress(row.address, 6)
      })
    }
  },
  {
    title: 'FEES PAID(SATS)',
    key: 'amount',
    sorter: true,
    align: 'center',
    render(row) {
      return formatNumber(row.amount, 0)
    }
  }
  // {
  //   title: 'PRIZE',
  //   key: 'prize',
  //   width: 150,
  //   align: 'center',
  //   render(row) {
  //     return formatNumber(row.prize)
  //   },
  // },
]

export const leaderboardAddressColumns: DataTableColumns<any> = [
  {
    title: 'INSCRIBER',
    key: 'address',
    width: 160,
    align: 'center',
    render(row) {
      const { path } = useApi()
      return h(TextLink, {
        to: path + '/address/' + row.address,
        text: shortAddress(row.address, 6)
      })
    }
  },
  // {
  //   title: 'CONSUMPTION(SATS)',
  //   key: 'amount',
  //   width: 150,
  //   align: 'center',
  //   render (row) {
  //     return formatNumber(row.amount)
  //   }
  // },
  {
    title: 'WEEKLY RANK',
    key: 'weeklyRank',
    width: 150,
    align: 'center',
    render(row) {
      return row.weeklyRank ?? '-'
    }
  },
  {
    title: 'MONTHLY RANK',
    key: 'monthlyRank',
    width: 150,
    align: 'center',
    render(row) {
      return row.monthlyRank ?? '-'
    }
  },
  {
    title: 'ALL-TIME RANK',
    key: 'allTimeRank',
    width: 150,
    align: 'center',
    render(row) {
      return row.allTimeRank ?? '-'
    }
  }
  // {
  //   title: 'PRIZE',
  //   key: 'prize',
  //   width: 150,
  //   align: 'center',
  //   render (row) {
  //     return '-'
  //   }
  // }
]

export const sellTokenWhitelistColumns: DataTableColumns<any> = [
  {
    title: 'BUYER',
    key: 'sellOrderWhiteListAddress',
    width: 160,
    align: 'center',
    render(row) {
      return h(TextLink, {
        text: shortAddress(row.sellOrderWhiteListAddress, 6),
        to: `/sell?seller=${row.sellOrderWhiteListAddress}`
      })
    }
  },
  {
    title: 'PERCENTAGE',
    key: 'sellOrderWhiteListPercentage',
    width: 180,
    align: 'center',
    render(row) {
      return h(NProgress, {
        type: 'line',
        color: '#fca121',
        percentage: Number(
          formatNumber(Number(row.sellOrderWhiteListPercentage ?? '0') * 100, 2)
        ),
        indicatorTextColor: '#ffffff',
        railColor: '#3F3E28'
      })
    }
  },
  {
    title: 'LIMIT',
    key: 'sellOrderWhiteListLim',
    width: 150,
    align: 'center',
    render(row) {
      return row.sellOrderWhiteListLim
        ? formatNumber(row.sellOrderWhiteListLim)
        : '-'
    }
  },
  {
    title: 'AMOUNT FILLED',
    key: 'sellOrderWhiteListAmountFilled',
    width: 150,
    align: 'center',
    render(row) {
      return row.sellOrderWhiteListAmountFilled
        ? formatNumber(row.sellOrderWhiteListAmountFilled)
        : '-'
    }
  },
  {
    title: 'AMOUNT LEFT',
    key: 'sellOrderWhiteListAmountLeft',
    width: 150,
    align: 'center',
    render(row) {
      return row.sellOrderWhiteListAmountLeft
        ? formatNumber(row.sellOrderWhiteListAmountLeft)
        : '-'
    }
  }
]

export const sellTokenBuyerListColumns: DataTableColumns<any> = [
  {
    title: 'BUYER',
    key: 'sellOrderDetailAddress',
    width: 160,
    align: 'center',
    render(row) {
      return h(TextLink, {
        text: shortAddress(row.sellOrderDetailAddress, 6),
        to: `/address/${row.sellOrderDetailAddress}`
      })
    }
  },
  {
    title: 'AMOUNT',
    key: 'sellOrderDetailTokenAmount',
    width: 180,
    align: 'center',
    render(row) {
      return formatNumber(row.sellOrderDetailTokenAmount, 3, {
        withEndZero: false
      })
    }
  },
  {
    title: 'TIMESTAMP',
    key: 'sellOrderDetailTxId',
    width: 150,
    align: 'center',
    render(row: any) {
      return h(CreateDateWithStatus, {
        timestamp: row.sellOrderDetailChainTime,
        hash: row.sellOrderDetailTxId,
        status: 1 - Number(row.sellOrderDetailStatus)
      })
    }
  }
]

export const voteProposalColumns: DataTableColumns<Orc20ProposeInfo> = [
  {
    title: 'VERSION',
    key: 'version',
    width: 100,
    align: 'center',
    render(row) {
      return row.proposal
    }
  },
  {
    title: 'PROPOSAL',
    key: 'content',
    width: 300,
    align: 'center',
    ellipsis: true,
    render(row) {
      return row.content
    }
  },
  {
    title: 'TICKER',
    key: 'voteTicker',
    width: 150,
    ellipsis: true,
    align: 'center',
    render(row) {
      return h(TextLink, {
        to: '/token/' + row.tokenInscriptionId,
        text: row.ticker
      })
    }
  },
  {
    title: 'TOKEN ID',
    key: 'tokenId',
    width: 100,
    ellipsis: true,
    align: 'center',
    render(row) {
      return row.tokenId
    }
  },
  {
    title: 'PROGRESS',
    key: 'progress',
    align: 'center',
    width: 200,
    render(row) {
      return h(ProposalProgress, {
        voteYes: formatNumber(
          (Number(row.voteYesAmount) / Number(row.voteQuorumAmount)) *
            Number(row.pass),
          2
        ),
        voteNo: formatNumber(
          (Number(row.voteNoAmount) / Number(row.voteQuorumAmount)) *
            Number(row.pass),
          2
        ),
        pass: row.pass,
        quorum: row.quorum
      })
    }
  },
  {
    title: 'STATUS',
    key: 'status',
    width: 120,
    align: 'center',
    render(row) {
      return Number(row.status) === 1
        ? 'Active'
        : Number(row.status) === 2
        ? 'Completed'
        : 'Expired'
    }
  },
  {
    title: 'TIMESTAMP',
    key: 'timestamp',
    width: 220,
    align: 'center',
    render(row) {
      return h(CreateDateWithStatus, {
        timestamp: row.chainTime!,
        inscription: row.inscriptionId!,
        status: 1
      })
    }
  }
]

export const proposalVoteListColumns: DataTableColumns<any> = [
  {
    title: 'VOTER',
    key: 'address',
    width: 160,
    align: 'center',
    render(row) {
      return h(TextLink, {
        text: shortAddress(row.voteAddress, 6),
        to: `/address/${row.voteAddress}`
      })
    }
  },
  {
    title: 'AMOUNT',
    key: 'voteAmount',
    width: 180,
    align: 'center',
    render(row) {
      return formatNumber(row.voteAmount, 3, {
        withEndZero: false
      })
    }
  },
  {
    title: 'VOTE',
    key: 'vote',
    width: 100,
    align: 'center',
    render(row) {
      return row.voteVote.toUpperCase()
    }
  },
  {
    title: 'MESSAGE',
    key: 'voteMsg',
    width: 250,
    align: 'center',
    ellipsis: true,
    render(row) {
      return h(VoteMessage, { message: row.voteMsg })
    }
  },
  {
    title: 'TIMESTAMP',
    key: 'timestamp',
    width: 150,
    align: 'center',
    render(row: any) {
      return h(CreateDateWithStatus, {
        timestamp: row.voteChainTime,
        inscription: row.voteInscriptionId,
        status: 1
      })
    }
  }
]
