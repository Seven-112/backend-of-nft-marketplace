export enum Caching {
  ALL_USER = 'all_user',
  USER_BY_ID = 'user_by_id',
  USER_BY_USERNAME = 'user_by_username',
  USER_BY_IDS = 'user_by_ids',
  USER_BY_WALLET_ADDRESS = 'user_by_wallet_address',
  USER_BY_EMAIL = 'user_by_email',
  SEARCH_USER = 'search_user',
  USER_BY_TIME = 'user_by_time',
}

/**Cache user
 * Get all user
 * Get user by wallet
 * Get user by id
 * Get user by ids
 * Search user
 * Get user by username
 */

/**Delete cache
 * Update profile: USER_BY_ID, USER_BY_IDS, USER_BY_WALLET_ADDRESS, SEARCH_USER, ALL_USER, USER_BY_USERNAME, USER_BY_EMAIL, USER_BY_TIME
 * Update socials: USER_BY_ID, USER_BY_IDS, USER_BY_WALLET_ADDRESS, SEARCH_USER, ALL_USER, USER_BY_USERNAME, USER_BY_EMAIL, USER_BY_TIME
 * Update wallet address: USER_BY_ID, USER_BY_IDS, USER_BY_WALLET_ADDRESS, SEARCH_USER, ALL_USER, USER_BY_USERNAME, USER_BY_EMAIL, USER_BY_TIME
 */
