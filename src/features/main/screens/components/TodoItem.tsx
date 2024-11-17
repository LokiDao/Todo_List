import { RootStackParams } from "@app/navigations/types/RootStackParams.type";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Checkbox,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Todo } from "../../models";

interface TodoItemProps {
  item: Todo;
  onComplete: () => void;
  onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onComplete, onDelete }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const handleEdit = () => {
    navigation.navigate("addTodo", { todo: item, isEditMode: true });
  };

  return (
    <Swipeable
      renderRightActions={() => (
        <HStack>
          {/* Swipe to edit */}
          <IconButton
            icon={<Ionicons name="pencil" size={24} color="blue" />}
            onPress={handleEdit}
          />
          {/* Swipe to delete */}
          <IconButton
            icon={<Ionicons name="trash" size={24} color="red" />}
            onPress={onDelete}
          />
        </HStack>
      )}
    >
      <HStack
        justifyContent="space-between"
        alignItems="center"
        bg="gray.800"
        p={4}
        mb={2}
        borderRadius="md"
      >
        <HStack space={4} alignItems="center">
          {/* Checkbox to mark task as complete */}
          <Checkbox
            isChecked={item.completed}
            onChange={onComplete}
            colorScheme="green"
            aria-label="Mark task as completed"
            value={item.title}
            _checked={{ bg: "green.500" }}
          />
          <VStack flex={1}>
            {/* Task title */}
            <HStack alignItems={"center"}>
              <Text
                color="white"
                fontSize="lg"
                bold
                strikeThrough={item.completed}
                numberOfLines={1}
                w={"45%"}
              >
                {item.title}
              </Text>
              <Spacer />
              {/* Due date */}
              <Text color="gray.400">
                {new Date(item.dueDate ?? new Date()).toLocaleString(
                  undefined,
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </Text>
            </HStack>
            <Text color="gray.400" numberOfLines={3}>
              {item.description}
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Swipeable>
  );
};

export default TodoItem;
