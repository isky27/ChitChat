import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
            onClick={handleFunction}
            display={"flex"}
            alignItems="center"
            gap="1"
        >   
            <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            />
            {user.name}
            {admin === user._id && <span> (Admin)</span>}
            <CloseIcon pl={1} />
        </Badge>
    );
};

export default UserBadgeItem;