export enum Caching {
  ALL_USER = 'all_user',
  ALL_EVENT = 'all_event',
  ALL_NFT = 'all_nft',
  ALL_NFT_BOUGHT = 'all_nft_bought',
  SEARCH_USER = 'search_user',
  USER_BY_ID = 'user_by_id',
  USER_BY_USERNAME = 'user_by_username',
  USER_BY_IDS = 'user_by_ids',
  USER_BY_WALLET_ADDRESS = 'user_by_wallet_address',
  USER_BY_EMAIL = 'user_by_email',
  USER_BY_TIME = 'user_by_time',
  EVENT_BY_ID = 'event_by_id',
  EVENT_BY_IDS = 'event_by_ids',
  EVENT_TICKET_BY_ID = 'event_ticket_by_id',
  EVENT_TICKET_BY_IDS = 'event_ticket_by_ids',
  NFT_BY_ID = 'nft_by_id',
  NFT_BOUGHT_BY_USER_ID = 'nft_bought_by_user_id',
  NFT_BOUGHT_BY_NFT_IDS = 'nft_bought_by_nft_ids',
}

/**Cache user
 * Get all user
 * Get user by wallet
 * Get user by id
 * Get user by ids
 * Search user
 * Get user by username
 */

/**Cache event
 * Get all event
 * Get event by id
 * Get event by ids
 * Get event ticket by id
 * Get event ticket by ids
 */

/**Delete cache
 * Update profile: USER_BY_ID, USER_BY_IDS, USER_BY_WALLET_ADDRESS, SEARCH_USER, ALL_USER, USER_BY_USERNAME, USER_BY_EMAIL, USER_BY_TIME
 * Update socials: USER_BY_ID, USER_BY_IDS, USER_BY_WALLET_ADDRESS, SEARCH_USER, ALL_USER, USER_BY_USERNAME, USER_BY_EMAIL, USER_BY_TIME
 * Update wallet address: USER_BY_ID, USER_BY_IDS, USER_BY_WALLET_ADDRESS, SEARCH_USER, ALL_USER, USER_BY_USERNAME, USER_BY_EMAIL, USER_BY_TIME
 */
