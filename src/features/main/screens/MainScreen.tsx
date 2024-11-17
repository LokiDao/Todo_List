import TabContent from "@app/components/UI/TabContent"; // Assuming TabContent handles tabs
import { RootStackParams } from "@app/navigations/types/RootStackParams.type";
import { useAppDispatch, useAppSelector } from "@app/stores";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import images from "assets/images";
import {
  Box,
  Center,
  Fab,
  FlatList,
  Icon,
  Image,
  Text,
  VStack,
} from "native-base";
import React, { useLayoutEffect, useState } from "react";
import { Todo } from "../models";
import { deleteTodo, toggleComplete } from "../slices";
import TodoItem from "./components/TodoItem";
import { hideDialog, showDialog } from "@app/stores/slices/dialog.slice";
import { DialogType } from "@app/stores/types/dialog.types";

const MainScreen = () => {
  const { todos } = useAppSelector((state) => state.main);
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, "main">>();
  const [activeTab, setActiveTab] = useState("Ongoing");
  const dispatch = useAppDispatch();

  const handleComplete = (id: string) => {
    dispatch(toggleComplete(id));
  };

  const handleDelete = (id: string) => {
    dispatch(
      showDialog({
        title: "Confirm",
        content: "Are you sure you want to delete this task?",
        type: DialogType.ALERT,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        onConfirm() {
          dispatch(hideDialog());
          dispatch(deleteTodo(id));
        },
      }),
    );
  };

  const ongoingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Todo List",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "white",
    });
  }, []);

  const renderTodoList = (filteredTodos: Todo[]) => {
    return filteredTodos.length === 0 ? (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Center>
          <Image source={images.check_list_empty} size={"xl"} alt="Empty" />
        </Center>
        <Text color="white" fontSize="2xl" mt={4}>
          What do you want to do today?
        </Text>
        <Text color="gray.400" fontSize="md">
          Tap + to add your tasks
        </Text>
      </Box>
    ) : (
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onComplete={() => handleComplete(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    );
  };

  const tabs = [
    {
      key: "Ongoing",
      title: "Ongoing",
      content: renderTodoList(ongoingTodos),
    },
    {
      key: "Completed",
      title: "Completed",
      content: renderTodoList(completedTodos),
    },
  ];

  return (
    <VStack flex={1} background={"black"} px={4}>
      <TabContent
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {route.name === "main" && (
        <Fab
          size="lg"
          colorScheme="violet"
          icon={<Icon color="white" as={<Ionicons name="add" />} size="md" />}
          onPress={() => navigation.navigate("addTodo", { isEditMode: false })}
        />
      )}
    </VStack>
  );
};

export default MainScreen;
