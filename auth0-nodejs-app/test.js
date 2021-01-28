function rule(user, context, callback) {
	const ManagementClient = require('auth0@2.23.0').ManagementClient;
	const management = new ManagementClient({
		domain: 'dev-17rcu4-9.auth0.com',
		clientId: 'OMURB1XuytvTzn5ac2OlZwzDArw75CX0',
		clientSecret:
			'BEdETWtLo3ddOeI6HGpcQRcLnSj_rPlic6wVHKDL2EpSQWykQA6T01V719y_uzaz'
	});

	const getRoles = async () => {
		const roles = await management.getRoles();
		return roles;
	};

	const getPermissionsForAllRoles = async () => {
		const roles = await getRoles();
		const permissionMap = roles.map(async (role) => {
			const permissions = await management.getPermissionsInRole({
				id: role.id
			});
			const rolePermissionMap = permissions.slice().map((each) => {
				return { ...each, role: role.name, roleId: role.id };
			});
			return rolePermissionMap;
		});
		const response = Promise.all(permissionMap);
		return response;
	};

	const auth0Rule = async (user, context) => {
		const roles = context.authorization.roles;
		const userRole = user.Role;
		if (roles.length === 0) {
			context.authorization.roles.push(userRole);
			const permissions = await getPermissionsForAllRoles();
			const permissionObject = permissions
				.flat()
				.find((each) => each.role === userRole);
			if (permissionObject) {
				const assignRoleToUser = await management.assignRolestoUser(
					{
						id: user.user_id
					},
					{ roles: [permissionObject.roleId] }
				);
				return { user, context };
			} else {
				throw new Error(`Specified role: ${userRole} is not created in Auth0`);
			}
		} else {
			return { user, context };
		}
	};
	auth0Rule(user, context)
		.then((res) => {
			return callback(null, res.user, res.context);
		})
		.catch((error) => callback(error));
}



