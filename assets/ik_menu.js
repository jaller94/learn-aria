;(function ( $, window, document, undefined ) {

	var pluginName = 'ik_menu',
		defaults = {
			'instructions': 'Use arrow keys to navigate between menu items, spacebar to expand sub-menus, escape key to close sub-menus, enter to activate menu items.'
		};
	 
	/**
	 * @constructs Plugin
	 * @param {Object} element - Current DOM element from selected collection.
	 * @param {Object} [options] - Configuration options.
	 */
	function Plugin( element, options ) {
		
		this._name = pluginName;
		this._defaults = defaults;
		this.element = $(element);
		this.options = $.extend( {}, defaults, options) ;
		
		this.init();
	}
	
	/** Initializes plugin. */
	Plugin.prototype.init = function () {
		
		var id, $elem, plugin;
		
		plugin = this;
		id = 'menu' + $('.ik_menu').length; // generate unique id
		$elem = plugin.element;
		
		$elem.addClass('ik_menu')
			.attr({
				'id': id,
				'aria-hidden': 'true'  // hide element from screen readers to prevent it from being read twice
			});
		
		$('<div/>') // add div element to be used with aria-described attribute of the menu
			.text(plugin.options.instructions) // get instruction text from plugin options
			.addClass('ik_readersonly') // hide element from visual display
			.attr({
				'id': id + '_instructions'
			})
			.appendTo(this.element);
			
		$elem.find('ul:eq(0)')
			.attr({
				'id': id,
				'role': 'menubar', // assign menubar role to the topmost ul element
				'tabindex': 0,
				'aria-labelledby': id + '_instructions'
			});
			
		$elem.find('li>ul')
			.attr({
				'role': 'menu',
				'aria-hidden': true // hide submenus from screen reader
			});
		
		plugin.menuitems = $elem.find('li') // setup menu items
			.css({ 'list-style': 'none' })
			.each(function(i, el) {
				
				var $me, $link;
				
				$me = $(this)
					.attr({
						'role': 'menuitem', // assign menuitem rols
						'tabindex': -1,  // remove from tab order
						'aria-label': $link.text() // label with link text
					});
				
				$link = $me.find('>a')
					.attr({ // disable links
						'tabindex': -1,
						'aria-hidden': true
					});
				
				$me.has('ul').addClass('expandable');
			});
		
		plugin.selected = plugin.menuitems // setup selected menuitem
			.find('.selected');
		
		if (!plugin.selected.length) {
			
			plugin.menuitems
				.eq(0);
			
		} else {
			
			plugin.selected
				.parentsUntil('nav', 'li');
			
		}
		
		plugin.menuitems // setup event handlers
			.on('mouseenter', plugin.showSubmenu)
			.on('mouseleave', plugin.hideSubmenu)
			.on('click', {'plugin': plugin}, plugin.activateMenuItem);
			
		$(window).on('resize', function(){ plugin.collapseAll(plugin); } ); // collapse all submenues when window is resized
		
	};
	
	/** 
	 * Shows submenu.
	 * 
	 * @param {object} event - Mouse event.
	 */
	Plugin.prototype.showSubmenu = function(event) {
		
		var $elem, $submenu;
		
		$elem = $(event.currentTarget);
		$submenu = $elem.children('ul');
		
		if ($submenu.length) {
			$elem.addClass('expanded');
		}
	};
	
	/** 
	 * Hides submenu.
	 * 
	 * @param {object} event - Mouse event.
	 */
	Plugin.prototype.hideSubmenu = function(event) {
		
		var $elem, $submenu;
		
		$elem = $(event.currentTarget);
		$submenu = $elem.children('ul');
		
		if ($submenu.length) {
			$elem.removeClass('expanded');

		}
	}
	
	/** 
	 * Collapses all submenus. Whem element is specified collapses all sumbenus inside that element.
	 * 
	 * @param {object} plugin - Reference to plugin.
	 * @param {object} [$elem] - jQuery object containing element (optional).
	 */
	Plugin.prototype.collapseAll = function(plugin, $elem) {
		
		$elem = $elem || plugin.element;
		
	};
	
	/** 
	 * Activates menu selected menuitem.
	 * 
	 * @param {Object} event - Keyboard or mouse event.
	 * @param {object} event.data - Event data.
	 * @param {object} event.data.plugin - Reference to plugin.
	 */
	Plugin.prototype.activateMenuItem = function(event) {
		
		var plugin, $elem;
		
		event.stopPropagation();
		
		plugin = event.data.plugin;
		$elem = $(event.currentTarget);
		
		plugin.collapseAll(plugin);
	
		if ($elem.has('a').length) {
			alert('Menu item ' + $elem.find('>a').text() + ' selected');
		}
		
	};
	
	
	$.fn[pluginName] = function ( options ) {
		
		return this.each(function () {
			
			if ( !$.data(this, pluginName )) {
				$.data( this, pluginName,
				new Plugin( this, options ));
			}
			
		});
		
	}
 
})( jQuery, window, document );