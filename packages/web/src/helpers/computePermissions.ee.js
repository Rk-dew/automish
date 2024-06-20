export function getRoleWithComputedPermissions(role) {
  if (!role) return {};
  const computedPermissions = role.permissions?.reduce(
    (computedPermissions, permission) => ({
      ...computedPermissions,
      [permission.subject]: {
        ...(computedPermissions[permission.subject] || {}),
        [permission.action]: {
          conditions: Object.fromEntries(
            permission.conditions.map((condition) => [condition, true]),
          ),
          value: true,
        },
      },
    }),
    {},
  );

  return {
    ...role,
    computedPermissions,
  };
}
export function getPermissions(computedPermissions) {
  if (!computedPermissions) return [];

  return Object.entries(computedPermissions).reduce(
    (permissions, computedPermissionEntry) => {
      const [subject, actionsWithConditions] = computedPermissionEntry;
      for (const action in actionsWithConditions) {
        const { value: permitted, conditions = {} } =
          actionsWithConditions[action];
        if (permitted) {
          permissions.push({
            action,
            subject,
            conditions: Object.entries(conditions)
              .filter(([, enabled]) => enabled)
              .map(([condition]) => condition),
          });
        }
      }
      return permissions;
    },
    [],
  );
}
