import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class MenuRepository {
  constructor(private readonly db: DatabaseService) { }

  async getMenuTreeAsync() {
    const menusQuery = `
      SELECT 
        menu_id        AS "menuId",
        parent_menu_id AS "parentMenuId",
        menu_key       AS "menuKey",
        display_name   AS "displayName",
        route_path     AS "routePath",
        menu_type      AS "menuType",
        icon_name      AS "iconName",
        display_order  AS "displayOrder"
      FROM m_menu
      WHERE del_status = false
        AND is_visible = true
      ORDER BY display_order
    `;

    const actionsQuery = `
      SELECT 
        menu_action_id AS "menuActionId",
        menu_id        AS "menuId",
        action_key     AS "actionKey",
        action_name    AS "actionName"
      FROM m_menu_action
      WHERE del_status = false
    `;

    const [menus, actions] = await Promise.all([
      this.db.query(menusQuery),
      this.db.query(actionsQuery),
    ]);

    // Format properties exactly as required vertically to maintain frontend compatibility
    const formattedMenus = menus.map(m => ({
      menuId: m.menuId,
      parentMenuId: m.parentMenuId,
      menuKey: m.menuKey,
      displayName: m.displayName,
      routePath: m.routePath,
      menuType: m.menuType,
      iconName: m.iconName,
      displayOrder: m.displayOrder,
      actions: [] as any[],
      children: [] as any[],
    }));

    // Attach actions
    formattedMenus.forEach(menu => {
      menu.actions = actions
        .filter(a => a.menuId === menu.menuId)
        .map(a => ({
          menuActionId: a.menuActionId,
          actionKey: a.actionKey,
          actionName: a.actionName,
        }));
    });

    // Build hierarchy
    const menuLookup = new Map();
    formattedMenus.forEach(menu => menuLookup.set(menu.menuId, menu));

    formattedMenus.forEach(menu => {
      if (menu.parentMenuId !== null && menuLookup.has(menu.parentMenuId)) {
        menuLookup.get(menu.parentMenuId).children.push(menu);
      }
    });

    // Return root menus
    return formattedMenus
      .filter(m => m.parentMenuId === null)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
}
