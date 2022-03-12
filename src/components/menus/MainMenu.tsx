import { Link } from 'react-router-dom';
import styles from '../../styles/menus/MainMenu.module.scss';

const MainMenu = () => {
	return (
		<div className={styles.menu_main}>
			<div className={styles.top}>
				<h3>Menu</h3>
			</div>
			<div className={styles.both_sides}>
				<div className={styles.left_side}>
					<h3>Social</h3>
					<div className={styles.social}>
						<ul>
							<li>
								<Link to='/'>
									<img src='single_icons/friends_icon.png' alt='Find friends' />
									<span>
										<h4>Find Friends</h4>
										<h5>Search for friends or people you may know.</h5>
									</span>
								</Link>
							</li>
							<li>
								<Link to='/'>
									<img src='single_icons/groups_icon.png' alt='Groups' />
									<span>
										<h4>Groups</h4>
										<h5>Connect with people who share your interests.</h5>
									</span>
								</Link>
							</li>
							<li>
								<Link to='/'>
									<img src='single_icons/events_icon.png' alt='Events' />
									<span>
										<h4>Events</h4>
										<h5>
											Organise or find events and other things to do online and
											nearby.
										</h5>
									</span>
								</Link>
							</li>
							<li>
								<Link to='/'>
									<img src='single_icons/news_feed_icon.png' alt='News Feed' />
									<span>
										<h4>News Feed</h4>
										<h5>
											See relevant posts from people and Pages that you follow.
										</h5>
									</span>
								</Link>
							</li>
							<li>
								<Link to='/'>
									<img src='single_icons/pages_icon.png' alt='Pages' />
									<span>
										<h4>Pages</h4>
										<h5>Discover and connect with businesses on Odinbook.</h5>
									</span>
								</Link>
							</li>
						</ul>
					</div>
					<hr />
					<div className={styles.entertainment}>
						<h3>Entertainment</h3>
						<ul>
							<li>
								<Link to='/'>
									<img src='single_icons/watch_icon.png' alt='Watch' />
									<span>
										<h4>Watch</h4>
										<h5>
											A video destination personalised to your interests and
											connections.
										</h5>
									</span>
								</Link>
							</li>
							<li>
								<Link to='/'>
									<img
										src='single_icons/gaming_video_icon.png'
										alt='Gaming video'
									/>
									<span>
										<h4>Gaming video</h4>
										<h5>
											Watch and connect with your favourite games and streamers.
										</h5>
									</span>
								</Link>
							</li>
							<li>
								<Link to='/'>
									<img
										src='single_icons/play_games_icon.png'
										alt='Play games'
									/>
									<span>
										<h4>Play games</h4>
										<h5>Play your favourite games.</h5>
									</span>
								</Link>
							</li>
						</ul>
					</div>
					<hr />
					<div className={styles.shopping}>
						<h3>Shopping</h3>
						<ul>
							<li>
								<Link to='/'>
									<img src='single_icons/marketplace_icon.png' alt='Watch' />
									<span>
										<h4>Marketplace</h4>
										<h5>Buy and sell in your community.</h5>
									</span>
								</Link>
							</li>
						</ul>
					</div>
					<hr />
					<div className={styles.personal}>
						<h3>Personal</h3>
						<ul>
							<li>
								<Link to='/'>
									<img src='single_icons/memories_icon.png' alt='Watch' />
									<span>
										<h4>Memories</h4>
										<h5>
											Browse your old photos, videos and posts on Odinbook.
										</h5>
									</span>
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className={styles.right_side}>
					<div>
						<h3>Create</h3>
						<ul>
							<li>
								<Link to='/' className={styles.post_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Post</h4>
								</Link>
							</li>
							<li>
								<Link to='/' className={styles.story_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Story</h4>
								</Link>
							</li>
							<li>
								<Link to='/' className={styles.life_event_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Life Event</h4>
								</Link>
							</li>
						</ul>
						<hr />
						<ul>
							<li>
								<Link to='/' className={styles.group_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Group</h4>
								</Link>
							</li>
							<li>
								<Link to='/' className={styles.page_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Page</h4>
								</Link>
							</li>
							<li>
								<Link to='/' className={styles.ad_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Ad</h4>
								</Link>
							</li>
							<li>
								<Link to='/' className={styles.event_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Event</h4>
								</Link>
							</li>
							<li>
								<Link to='/' className={styles.marketplace_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Marketplace Listing</h4>
								</Link>
							</li>
							<li>
								<Link to='/' className={styles.fundraiser_link}>
									<div className={styles.icon}>
										<span></span>
									</div>
									<h4>Fundraiser</h4>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainMenu;
