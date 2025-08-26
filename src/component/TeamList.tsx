import React from "react";
import { View, FlatList } from "react-native";
import { TeamCard } from "./TeamCard";
import { AddTeamCard } from "./AddTeamCard";
import styles from "../styles/MainHomeScreenStyles";

type Role = "MEMBER" | "LEADER";

interface Team {
  id: number;
  teamName: string;
  role: Role;
}

type TeamCardItem = Team | { id: "add-button" };

type TeamListProps = {
  teams: Team[];
  onTeamSelect: (team: Team) => void;
  onAddTeam: () => void;
};

export const TeamList: React.FC<TeamListProps> = ({
  teams,
  onTeamSelect,
  onAddTeam,
}) => {
  const renderTeamCard = ({ item }: { item: Team }) => (
    <TeamCard team={item} onPress={onTeamSelect} />
  );

  const renderAddCard = () => (
    <AddTeamCard onPress={onAddTeam} />
  );

  const renderItem = ({ item }: { item: TeamCardItem }) => {
    if (item.id === "add-button") {
      return renderAddCard();
    }
    return renderTeamCard({ item: item as Team });
  };

  const data: TeamCardItem[] = [...teams, { id: "add-button" }];

  return (
    <View style={styles.teamListOuter}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.teamListContent}
      />
    </View>
  );
};
